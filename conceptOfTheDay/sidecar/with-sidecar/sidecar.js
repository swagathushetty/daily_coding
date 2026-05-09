
const http      = require('http');
const httpProxy = require('http-proxy');
const jwt       = require('jsonwebtoken');

const SIDECAR_PORT    = 8080;
const MAIN_SERVICE    = 'http://127.0.0.1:3000';
const JWT_SECRET      = 'super-secret-key';


const metrics = {
  totalRequests:  0,
  authFailures:   0,
  statusCodes:    {},
  latencyBuckets: { lt10: 0, lt50: 0, lt100: 0, lt500: 0, slow: 0 },
  recentRequests: [],

  record(method, path, status, ms, userId) {
    this.totalRequests++;
    this.statusCodes[status] = (this.statusCodes[status] || 0) + 1;

    if      (ms < 10)  this.latencyBuckets.lt10++;
    else if (ms < 50)  this.latencyBuckets.lt50++;
    else if (ms < 100) this.latencyBuckets.lt100++;
    else if (ms < 500) this.latencyBuckets.lt500++;
    else               this.latencyBuckets.slow++;

    this.recentRequests.push({ method, path, status, ms, userId, at: new Date().toISOString() });
    if (this.recentRequests.length > 20) this.recentRequests.shift();
  },
};

// ─── Structured logger ────────────────────────────────────────────────────────

function log(level, message, extra = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    component: 'sidecar',
    message,
    ...extra,
  }));
}

// ─── Auth — validate JWT and extract user identity ───────────────────────────

function validateToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { ok: false, reason: 'Missing Bearer token' };
  }
  try {
    const payload = jwt.verify(authHeader.slice(7), JWT_SECRET);
    return { ok: true, payload };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

// ─── Proxy setup ──────────────────────────────────────────────────────────────

const proxy = httpProxy.createProxyServer({ target: MAIN_SERVICE });

proxy.on('error', (err, req, res) => {
  log('error', 'Proxy error — main service unreachable?', { err: err.message });
  res.writeHead(502);
  res.end(JSON.stringify({ error: 'Bad Gateway — main service is down' }));
});

// ─── HTTP server — intercepts every inbound request ──────────────────────────

const server = http.createServer((req, res) => {
  const startTime = Date.now();

  // ── Skip auth for the sidecar's own health/metrics endpoints ─────────────
  if (req.url === '/sidecar/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', component: 'sidecar', port: SIDECAR_PORT }));
    return;
  }

  if (req.url === '/sidecar/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(metrics));
    return;
  }

  // ── Token helper so the demo can get a JWT ────────────────────────────────
  if (req.url === '/dev/token' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { userId = 'user-42' } = JSON.parse(body || '{}');
        const token = jwt.sign({ sub: userId, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token }));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  // ── Step 1: Authentication ────────────────────────────────────────────────
  const auth = validateToken(req.headers['authorization']);
  if (!auth.ok) {
    metrics.authFailures++;
    log('warn', 'Auth rejected', { path: req.url, reason: auth.reason });
    metrics.record(req.method, req.url, 401, Date.now() - startTime, null);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: auth.reason }));
    return;
  }

  // ── Step 2: Inject user identity as trusted headers ───────────────────────
  // The main service reads these instead of parsing the JWT itself.
  req.headers['x-user-id']   = auth.payload.sub;
  req.headers['x-user-role'] = auth.payload.role || 'user';
  // Remove raw auth header — main service never sees the JWT
  delete req.headers['authorization'];

  // ── Step 3: Log the inbound request ──────────────────────────────────────
  log('info', 'Request received', {
    method: req.method,
    path:   req.url,
    userId: auth.payload.sub,
  });

  // ── Step 4: Capture response status (for metrics) ─────────────────────────
  // http-proxy writes to the raw socket, so we intercept writeHead.
  const originalWriteHead = res.writeHead.bind(res);
  let capturedStatus = 200;
  res.writeHead = (statusCode, headers) => {
    capturedStatus = statusCode;
    return originalWriteHead(statusCode, headers);
  };

  res.on('finish', () => {
    const ms = Date.now() - startTime;
    metrics.record(req.method, req.url, capturedStatus, ms, auth.payload.sub);
    log('info', 'Request completed', {
      method: req.method,
      path:   req.url,
      status: capturedStatus,
      ms,
      userId: auth.payload.sub,
    });
  });

  // ── Step 5: Forward to main service ──────────────────────────────────────
  proxy.web(req, res);
});

// ─── Start ────────────────────────────────────────────────────────────────────

server.listen(SIDECAR_PORT, () => {
  log('info', 'Sidecar proxy started', {
    listeningOn: `0.0.0.0:${SIDECAR_PORT}`,
    proxying:    MAIN_SERVICE,
    handles:     ['auth', 'logging', 'metrics'],
  });
  console.log(`\n[SIDECAR] All external traffic goes through :${SIDECAR_PORT}`);
  console.log(`[SIDECAR] Main service is isolated at ${MAIN_SERVICE}\n`);
  console.log('Try:');
  console.log(`  curl -X POST http://localhost:${SIDECAR_PORT}/dev/token -H 'Content-Type: application/json' -d '{"userId":"alice"}'`);
  console.log(`  curl http://localhost:${SIDECAR_PORT}/orders -H 'Authorization: Bearer <token>'`);
  console.log(`  curl http://localhost:${SIDECAR_PORT}/sidecar/metrics\n`);
});
