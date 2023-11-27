const { Pool } = require('pg');
const config = require('../../config');

module.exports = {
  getConnection: async () => {
    try {
      const pool = new Pool(config.db);

      pool.on('error', (err) => {
        console.error(`Some error occured on PG = ${err}`);
      });

      return pool;
    } catch (e) {
      console.error(`Could not initialize postgres connection: ${e}`);
      return null;
    }
  },
};
