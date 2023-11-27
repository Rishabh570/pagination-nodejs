const app = require('./src/app');
const { PORT } = require('./config');

const server = app.listen(PORT, () => {
  console.log(`🎉🎉🎉 Application running on port: ${PORT} 🎉🎉🎉`);
});

module.exports = server;