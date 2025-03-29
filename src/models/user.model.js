'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';

const UserSchema = new Schema(
  {
    // Authentication details
    user_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    user_password: {
      type: String,
      required: true,
    },
    user_role: {
      type: String,
      enum: ['customer', 'admin', 'seller'],
      default: 'customer',
    },

    // Personal details
    user_full_name: {
      type: String,
      required: true,
      trim: true,
    },
    user_phone: {
      type: String,
      required: true,
    },
    user_date_of_birth: {
      type: Date,
      default: null,
    },

    // Address details
    user_addresses: [
      {
        full_name: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postal_code: { type: String, required: true },
        is_default: { type: Boolean, default: false }, // Indicates the default address
      },
    ],

    // Payment methods
    user_payment_methods: [
      {
        card_holder_name: { type: String, required: true },
        card_number: { type: String, required: true },
        card_expiry_date: { type: String, required: true },
        card_cvv: { type: String, required: true },
        is_default: { type: Boolean, default: false }, // Indicates the default payment method
      },
    ],

    // Order history
    user_order_history: [
      {
        order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        order_date: { type: Date, required: true },
        order_status: {
          type: String,
          enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
          required: true,
        },
        total_payment: { type: Number, required: true },
      },
    ],

    // Account status
    user_status: {
      type: String,
      enum: ['active', 'inactive', 'banned'],
      default: 'active',
    },
  },
  {
    timestamps: true, // Automatically adds created_at and updated_at fields
    collection: COLLECTION_NAME,
  },
);

export default model(DOCUMENT_NAME, UserSchema);
