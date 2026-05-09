

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = 3000;
const JWT_SECRET = 'super-secret-key';

// ─── Fake in-memory data ──────────────────────────────────────────────────────

const ORDERS = [
  { id: 1, product: 'Laptop',  qty: 1, total: 1299 },
  { id: 2, product: 'Monitor', qty: 2, total: 598  },
  { id: 3, product: 'Keyboard',qty: 1, total: 89   },
];

// ─── Cross-cutting concern #1 — In-process metrics ───────────────────────────
// In a real system this would be prom-client, StatsD, Datadog SDK, etc.
// You have to add this to EVERY service.

const metrics = {
  counters: {},
  timings: [],

  increment(key) {
    this.counters[key] = (this.counters[key] || 0) + 1;
  },
  timing(key, ms) {
    this.timings.push({ key, ms, at: new Date().toISOString() });
  },
  dump() {
    return { counters: this.counters, recentTimings: this.timings.slice(-5) };
  },
};

// ─── Cross-cutting concern #2 — In-process logger ────────────────────────────
// Again, every service needs this wired up manually.

function log(level, message, extra = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service: 'order-service',    // ← hardcoded per-service
    message,
    ...extra,
  };
  console.log(JSON.stringify(entry));
}

// ─── Cross-cutting concern #3 — Auth middleware ───────────────────────────────
// Each service validates tokens independently. If the algorithm or secret
// changes, you update all services.

function authMiddleware(req, res, next) {
    req.user = { sub: 'user-42', role: 'user' }; // <-- TEMPORARY HACK, REMOVE ME
    next()
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    metrics.increment('auth.missing');
    log('warn', 'Missing auth token', { path: req.path });
    return res.status(401).json({ error: 'Missing Bearer token' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    metrics.increment('auth.success');
    next();
  } catch (err) {
    metrics.increment('auth.invalid');
    log('warn', 'Invalid token', { path: req.path, err: err.message });
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ─── Cross-cutting concern #4 — Request logging middleware ────────────────────

function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.timing('request.duration', duration);
    metrics.increment(`http.${res.statusCode}`);
    log('info', 'Request completed', {
      method: req.method,
      path:   req.path,
      status: res.statusCode,
      ms:     duration,
      user:   req.user?.sub ?? 'anonymous',
    });
  });
  next();
}

// Apply cross-cutting middleware — must do this in EVERY service
app.use(requestLogger);
app.use(authMiddleware);

// ─── Actual business logic ────────────────────────────────────────────────────
// Notice how thin this is — yet it's buried under all the middleware above.

app.get('/orders', (req, res) => {
  log('debug', 'Fetching all orders', { user: req.user.sub });
  res.json({ orders: ORDERS, fetchedBy: req.user.sub });
});

app.get('/orders/:id', (req, res) => {
  const order = ORDERS.find(o => o.id === Number(req.params.id));
  if (!order) {
    metrics.increment('orders.not_found');
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.post('/orders', (req, res) => {
  const { product, qty, total } = req.body;
  if (!product || !qty || !total) {
    return res.status(400).json({ error: 'product, qty, total required' });
  }
  const newOrder = { id: ORDERS.length + 1, product, qty, total };
  ORDERS.push(newOrder);
  metrics.increment('orders.created');
  log('info', 'Order created', { orderId: newOrder.id, user: req.user.sub });
  res.status(201).json(newOrder);
});

// Expose internal metrics — also something you wire manually per service
app.get('/internal/metrics', (req, res) => {
  res.json(metrics.dump());
});

// ─── Token helper — generate a test JWT ──────────────────────────────────────

app.post('/dev/token', (req, res) => {
  const token = jwt.sign({ sub: req.body.userId || 'user-42', role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n[WITHOUT SIDECAR] Order service running on http://localhost:${PORT}`);
  console.log('All concerns (auth, logging, metrics) live inside this process.\n');
  console.log('Try:');
  console.log(`  curl -X POST http://localhost:${PORT}/dev/token -H 'Content-Type: application/json' -d '{"userId":"alice"}'`);
  console.log(`  curl http://localhost:${PORT}/orders -H 'Authorization: Bearer <token>'`);
  console.log(`  curl http://localhost:${PORT}/internal/metrics\n`);
});
