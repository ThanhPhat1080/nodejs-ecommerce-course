'use strict';

import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';

// Declare the Schema of the Mongo model
const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      require: true,
      unique: true,
    },
    status: {
      type: Boolean,
      require: false,
      default: true,
    },
    permissions: {
      type: [String],
      require: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

// Export the model
export default model(DOCUMENT_NAME, apiKeySchema);
