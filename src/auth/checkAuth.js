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

const asyncHandler = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

export { apiKey, asyncHandler, permission };

