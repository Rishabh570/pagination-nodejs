const { HTTP_STATUS_CODES } = require('../../constants');

module.exports = ({ service }) => {
  async function create(req, res) {
    try {  
      await service.itemService.create();
  
      // Return the newly generated item
      return res.status(HTTP_STATUS_CODES.SUCCESS).json({
        status: true,
        message: 'Item created successfully',
        data: null,
      });
    } catch (err) {
      return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Could not create item',
        error: err,
      });
    }
  }
  
  async function get(req, res) {
    try {
      const { dir, order } = req.params;

      const rows = await service.itemService.read({ dir, order });
      if (rows && rows.length === 0) {
        return res.status(HTTP_STATUS_CODES.SUCCESS).json({
          status: true,
          message: 'No item found',
          data: null
        });
      }
  
      return res.status(HTTP_STATUS_CODES.SUCCESS).json({
        status: true,
        message: 'Item fetched successfully',
        data: rows,
      });
    } catch (err) {
      return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Failed to fetch',
        error: err,
      });
    }
  }

  return {
    create,
    get,
  }
};
