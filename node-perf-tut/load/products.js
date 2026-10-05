// k6 scenario for /products — ramps load so you can see where it breaks.
//   k6 run load/products.js           (against Node directly, :3000)
//   BASE=http://localhost:8080 k6 run load/products.js   (through nginx)
import http from 'k6/http'
import { check } from 'k6'

const BASE = __ENV.BASE || 'http://localhost:3000'

export const options = {
  stages: [
    { duration: '10s', target: 50 },  // ramp up
    { duration: '20s', target: 200 }, // sustained
    { duration: '10s', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<500'], // p99 under 500ms — will FAIL pre-fixes
    http_req_failed: ['rate<0.01'],
  },
}

export default function () {
  const res = http.get(`${BASE}/products?limit=20`)
  check(res, { '200': (r) => r.status === 200 })
}
