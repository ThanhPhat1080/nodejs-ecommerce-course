'use strict';

import { Schema, model } from 'mongoose';
import slugify from 'slugify';

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

// Create Index
productSchema.index({ product_name: 'text', product_description: 'text' });

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

// Product Document middleware
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

export const productModel = model(DOCUMENT_NAME, productSchema);
export const bookModel = model('Book', bookSchema);
export const electronicsModel = model('Electronics', electronicsSchema);
export const clothingModel = model('Clothing', clothingSchema);
