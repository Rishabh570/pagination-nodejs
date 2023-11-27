module.exports = ({ service }) => {
  const itemController = require('./item')({ service });

  return {
    itemController,
  }
};
