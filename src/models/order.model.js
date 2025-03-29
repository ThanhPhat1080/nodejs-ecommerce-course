'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

const OrderSchema = new Schema(
  {
    // The user who placed the order
    order_user_id: {
      type: Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: true,
    },

    // Checkout details: total price, total discount, fee ship, total payment
    order_checkout: {
      total_price: { type: Number, required: true }, // Total price before discounts
      total_discount: { type: Number, default: 0 }, // Total discount applied
      fee_ship: { type: Number, default: 0 }, // Shipping fee
      total_payment: { type: Number, required: true }, // Final payment amount
    },

    // Shipping details
    order_shipping: {
      full_name: { type: String, required: true }, // Full name of the recipient
      phone: { type: String, required: true }, // Contact phone number
      street: { type: String, required: true }, // Street address
      city: { type: String, required: true }, // City
      state: { type: String, required: true }, // State
      country: { type: String, required: true }, // Country
      postal_code: { type: String, required: true }, // Postal/ZIP code
    },

    // Payment details
    order_payment: {
      method: {
        type: String,
        enum: ['credit_card', 'paypal', 'cash_on_delivery', 'bank_transfer'],
        required: true,
      }, // Payment method
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      }, // Payment status
      transaction_id: { type: String, default: null }, // Transaction ID for payment
    },

    // Products in the order
    order_products: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
        name: { type: String, required: true }, // Product name
        price: { type: Number, required: true }, // Product price
        quantity: { type: Number, required: true }, // Quantity ordered
      },
    ],

    // Tracking details
    order_tracking_number: { type: String, default: () => `#${Date.now()}` }, // Unique tracking number
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
    }, // Order status

    // Additional metadata
    order_notes: { type: String, default: '' }, // Notes from the user
  },
  {
    timestamps: true, // Automatically adds created_at and updated_at fields
    collection: COLLECTION_NAME,
  },
);

export default model(DOCUMENT_NAME, OrderSchema);
