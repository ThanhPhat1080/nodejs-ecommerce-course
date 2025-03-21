'use strict';

import { AuthFailureError, ForbiddenError } from '../core/error.response.js';
import { asyncHandler } from '../helpers/common.js';
import ApiKeyService from '../services/apiKey.service.js';

export const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
};

const apiKey = asyncHandler(async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();

  if (!key) {
    throw new ForbiddenError('x-API key is required!');
  }

  const objectKey = await ApiKeyService.findById(key);
  if (!objectKey) {
    throw new ForbiddenError('x-API key is invalid!');
  }

  req.objectKey = objectKey;

  return next();
});

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objectKey.permissions) {
      return new AuthFailureError('Missing permission!');
    }

    const validPermission = req.objectKey.permissions.includes(permission);
    if (!validPermission) {
      return new AuthFailureError("You don't have permission to access this resource!");
    }

    return next();
  };
};

export { apiKey, permission };
