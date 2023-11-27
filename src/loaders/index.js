const postgres = require('./postgres');
const serviceLoader = require('./service');

module.exports = {
  run: () => {
    return new Promise(async (resolve) => {
      pgClient = await postgres.getConnection();
      const service = serviceLoader.init({ postgres: pgClient });
      // other dependencies init goes here...

      resolve({ service });
    });
  },
};
