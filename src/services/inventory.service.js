'use strict';
import { BadRequestError } from '../core/error.response';
import { inventoryModel } from '../models/inventory.model.js';

import * as ProductRepo from '../models/repositories/product.repo.js';

class InventoryService {
  static async addProductStock({ stock, productId, shopId, location = '123 Hoang Dieu' }) {
    const product = await ProductRepo.findProduct({ product_id: productId });
    if (!product) throw new BadRequestError('The product does not exist');

    const query = {
      inventory_shopId: shopId,
      inventory_productId: productId,
    };
    const querySet = {
      $inc: {
        inventory_stock: stock,
      },
      $set: {
        inventory_location: location,
      },
    };
    const option = {
      upsert: true,
      new: true,
    };

    return await inventoryModel.findOneAndUpdate(query, querySet, option);
  }
}

export default InventoryService;
