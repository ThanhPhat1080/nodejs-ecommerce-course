import { inventoryModel } from '../inventory.model.js';

export const insertInventory = async ({ productId, shopId, stock, location }) => {
  return await inventoryModel.create({
    inventory_product_id: productId,
    inventory_location: location,
    inventory_stock: stock,
    inventory_shopId: shopId,
  });
};
