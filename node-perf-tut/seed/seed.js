import pg from 'pg'
import crypto from 'node:crypto'
import { config } from '../src/config.js'

// Seeds swiftcart: products, users, and a LARGE orders table so the streaming
// export (Task 18) and N+1 (Task 5) lessons are visceral.
// Tune ORDER_COUNT down if your machine is small; 500k makes the point.
const PRODUCT_COUNT = 200
const USER_COUNT = 50
const ORDER_COUNT = Number(process.env.ORDER_COUNT || 500_000)

const client = new pg.Client(config.pg)

async function main() {
  await client.connect()
  console.log('creating schema…')
  await client.query(`
    DROP TABLE IF EXISTS login_events, orders, products, users CASCADE;
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price_cents INT NOT NULL,
      rating REAL NOT NULL DEFAULT 0
    );
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL
    );
    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      product_id INT NOT NULL,
      total_cents INT NOT NULL
    );
    CREATE TABLE login_events (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    -- 📝 TASK 5/DB-course NOTE: orders.product_id has NO index on purpose.
    -- In the DB course you'll EXPLAIN ANALYZE the N+1 query and add one.
  `)

  console.log(`inserting ${PRODUCT_COUNT} products…`)
  for (let i = 1; i <= PRODUCT_COUNT; i++) {
    await client.query(
      'INSERT INTO products (name, price_cents, rating) VALUES ($1, $2, $3)',
      [`Product ${i}`, 100 + i * 7, Math.round(Math.random() * 50) / 10],
    )
  }

  console.log(`inserting ${USER_COUNT} users (password = "pw<N>")…`)
  for (let i = 1; i <= USER_COUNT; i++) {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto
      .pbkdf2Sync(`pw${i}`, salt, 100_000, 64, 'sha512')
      .toString('hex')
    await client.query(
      'INSERT INTO users (email, password_hash, salt) VALUES ($1, $2, $3)',
      [`user${i}@shop.com`, hash, salt],
    )
  }

  console.log(`inserting ${ORDER_COUNT} orders (batched)…`)
  const BATCH = 5_000
  for (let start = 0; start < ORDER_COUNT; start += BATCH) {
    const values = []
    const params = []
    const n = Math.min(BATCH, ORDER_COUNT - start)
    for (let k = 0; k < n; k++) {
      params.push(`($${k * 2 + 1}, $${k * 2 + 2})`)
      values.push(1 + Math.floor(Math.random() * PRODUCT_COUNT), 50 + Math.floor(Math.random() * 90000))
    }
    await client.query(
      `INSERT INTO orders (product_id, total_cents) VALUES ${params.join(',')}`,
      values,
    )
    if (start % 50_000 === 0) console.log(`  …${start}`)
  }

  console.log('done. Login test: user1@shop.com / pw1')
  await client.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
