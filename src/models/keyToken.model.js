'use strict'

import { Schema , model} from 'mongoose';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      require: true,
      ref: 'Shop'
    },
    publicKey: {
      type: String,
      require: true,
    },
    privateKey: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: Array,
      default: []
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

// Export the model
export default model(DOCUMENT_NAME, keyTokenSchema);
