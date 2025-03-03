'use strict';

import ApiKeyService from '../services/apiKey.service.js';

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    const objectKey = await ApiKeyService.findById(key);
    if (!objectKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    req.objectKey = objectKey;

    return next();
  } catch (error) {}
};

export { apiKey };

