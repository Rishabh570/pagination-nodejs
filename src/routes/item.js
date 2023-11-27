const express = require('express');

const itemRouter = express.Router();

module.exports = ({ service }) => {
  const { itemController } = require('../controller')({ service });

  itemRouter.post('/create', itemController.create);
  itemRouter.get('/:dir/:inc', itemController.get);
  // fallback routes
  itemRouter.get('/:dir', itemController.get);
  itemRouter.get('/', itemController.get);

  return itemRouter;
}
