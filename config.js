module.exports = {
  PORT: process.env.PORT || 3001,
  db: {
    user: process.env.DB_USER || 'myuser',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_USER_PASSWORD || 'password',
    port: 5432,
  }
}