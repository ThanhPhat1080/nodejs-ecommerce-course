'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const InventorySchema = new Schema(
  {
    inventory_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    inventory_stock: {
      type: Number,
      required: true,
      min: 0,
    },
    inventory_location: {
      type: String,
      required: true,
    },
    inventory_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    inventory_reservations: {
      type: [Schema.Types.Mixed],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const inventoryModel = model(DOCUMENT_NAME, InventorySchema);
