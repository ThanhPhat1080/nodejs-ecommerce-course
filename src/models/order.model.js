'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const OrderSchema = new Schema(
  {
    order_userId: {
      type: Number, // TODO: user
      required: true,
    },

    /**
     * order_checkout: { totalPrice, totalApplyDiscount, feeShip }
     */
    order_checkout: {
      type: Object,
      default: {},
    },

    /**
     * order_shipping: { street, city, state, country }
     */
    order_shipping: {
      type: Object,
      required: true,
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_product: {
      type: Array,
      required: true,
    },
    order_trackingNumber: { type: String, default: '#1235432123' },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export const orderModel = model(DOCUMENT_NAME, OrderSchema);
