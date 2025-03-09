'use strict';

import apiKeyModel from '../models/apiKey.model.js';

class ApiKeyService {
  static findById = async (key) => {
    //   const newKey = await apiKeyModel.create({
    //     key: crypto.randomBytes(64).toString('hex'),
    //     permissions: ['0000']
    //   })
    // console.log('newKey', newKey);
    const objectKey = await apiKeyModel.findOne({ key, status: true }).lean();

    return objectKey;
  };
}

export default ApiKeyService;
