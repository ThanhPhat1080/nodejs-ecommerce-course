'use strict';

import { SuccessResponse } from '../core/success.response.js';
import InventoryService from '../services/inventory.service.js';

class InventoryController {
  static async addProductStock(req, res) {
    const { productId, shopId, stock, location } = req.body;

    return new SuccessResponse({
      message: 'Add product stock success!',
      metadata: await InventoryService.addProductStock({
        productId,
        shopId,
        stock,
        location,
      }),
    }).send(res);
  }
}

export default InventoryController;
