'use strict';

import apiKeyModel from '../models/apiKey.model.js';

class ApiKeyService {
  static findById = async (key) => {
    const objectKey = await apiKeyModel.findOne({ key, status: true }).lean();

    return objectKey;
  };
}

export default ApiKeyService;
