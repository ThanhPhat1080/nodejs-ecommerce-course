'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const InventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    inven_location: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Books'],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_slug: {
      type: String,
      unique: true,
    },

    // More
    product_ratingsAvg: {
      type: Number,
      default: 3,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: [Schema.Types.Mixed],
      required: false,
      default: [],
    },
    isDraft: {
      type: Boolean,
      index: true,
      default: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      index: true,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const inventoryModel = model(DOCUMENT_NAME, InventorySchema);
