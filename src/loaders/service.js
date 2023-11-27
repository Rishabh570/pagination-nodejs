module.exports = {
  init: ({ postgres }) => {
    return require('../service')({ postgres });
  }
}