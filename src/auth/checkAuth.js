'use strict';

import ApiKeyService from '../services/apiKey.service.js';

export const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id'
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
  } catch (error) { }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objectKey.permissions) {
      return res.status(403).json({ message: "Permission denied!" })
    }

    const validPermission = req.objectKey.permissions.includes(permission)
    if (!validPermission) {
      return res.status(403).json({ message: "Permission denied!" })

    }
    return next()
  }
};



export { apiKey, permission };

