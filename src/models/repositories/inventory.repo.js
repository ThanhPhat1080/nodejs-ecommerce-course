import { convertToMongooesObjectId } from '../../utils/index.js';
import { inventoryModel } from '../inventory.model.js';

export const insertInventory = async ({ productId, shopId, stock, location }) => {
  return await inventoryModel.create({
    inventory_productId: productId,
    inventory_location: location,
    inventory_stock: stock,
    inventory_shopId: shopId,
  });
};

export const reservationInventory = async ({ productId, quantity, cardId }) => {
  const query = {
    inventory_productId: convertToMongooesObjectId(productId),
    inventory_stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: {
      inventory_stock: -quantity,
    },
    $push: {
      inventory_reservations: {
        quantity,
        cardId,
        createdOn: new Date(),
      },
    },
  };

  const options = { upsert: true, new: true };

  return inventoryModel.updateOne(query, updateSet, options);
};
