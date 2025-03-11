'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Product';

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
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
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);
const bookSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'Book',
  },
);
const electronicsSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    warranty: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'Electronics',
  },
);
const clothingSchema = new Schema(
  {
    material: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'Clothing',
  },
);

export const productModel = model(DOCUMENT_NAME, productSchema);
export const bookModel = model('Book', bookSchema);
export const electronicsModel = model('Electronics', electronicsSchema);
export const clothingModel = model('Clothing', clothingSchema);
