
const express = require('express');

const app = express();
app.use(express.json());

const PORT = 3000;

// ─── Fake in-memory data ──────────────────────────────────────────────────────

const ORDERS = [
  { id: 1, product: 'Laptop',   qty: 1, total: 1299 },
  { id: 2, product: 'Monitor',  qty: 2, total: 598  },
  { id: 3, product: 'Keyboard', qty: 1, total: 89   },
];

// ─── Business logic only — no auth, no logging, no metrics ───────────────────

app.get('/orders', (req, res) => {
  // x-user-id injected by the sidecar after it validated the JWT
  const userId = req.headers['x-user-id'] || 'unknown';
  res.json({ orders: ORDERS, fetchedBy: userId });
});

app.get('/orders/:id', (req, res) => {
  const order = ORDERS.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/orders', (req, res) => {
  const { product, qty, total } = req.body;
  if (!product || !qty || !total) {
    return res.status(400).json({ error: 'product, qty, total required' });
  }
  const newOrder = { id: ORDERS.length + 1, product, qty, total };
  ORDERS.push(newOrder);
  res.status(201).json(newOrder);
});

// ─── Health check — the sidecar polls this to know if main service is up ─────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'order-service', port: PORT });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, '127.0.0.1', () => {
  // Bound to 127.0.0.1 — intentionally not 0.0.0.0
  // External callers cannot reach this port directly
  console.log(`[MAIN SERVICE] Listening on localhost:${PORT} (internal only)`);
  console.log('[MAIN SERVICE] No auth, logging, or metrics code here.\n');
});
