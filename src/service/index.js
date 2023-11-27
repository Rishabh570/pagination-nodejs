module.exports = ({ postgres }) => {
  const itemService = require('./item')({ postgres });

  return {
    itemService,
  }
}
