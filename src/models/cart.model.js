'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema(
  {
    cart_state: { type: String, enum: ['active', 'complete', 'failed', 'pending'], required: true },

    /**
     * {
     *   productId,
     *   shopId,
     *   quantity,
     *   price,
     *   name
     * }
     */
    cart_products: { type: Array, required: true, default: [] },
    cart_userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cart_product_count: { type: Number, required: true, default: 0, min: 0 },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export default model(DOCUMENT_NAME, cartSchema);
