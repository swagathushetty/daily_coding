export const config = {
  port: Number(process.env.PORT || 3000),
  pg: {
    host: 'localhost',
    port: 5432,
    user: 'swift',
    password: 'swift',
    database: 'swiftcart',
  },
  redisUrl: 'redis://localhost:6379',
}
