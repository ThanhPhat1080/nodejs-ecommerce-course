'use strict';

import JWT from 'jsonwebtoken';
import { AuthFailureError, NotFoundError } from '../core/error.response.js';
import { asyncHandler } from '../helpers/common.js';
import KeyTokenService from '../services/keyToken.service.js';
import { HEADER } from './checkAuth.js';

const createTokenPair = ({ payload, publicKey, privateKey }) => {
  try {
    // Access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error('err:', err);
      } else {
        console.log('===>', decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1.missing user is? User is on header
   * 2.get key access token by user
   * 3. verifyToken
   * 4 check user db
   * 5 check keyStore with user id
   *
   */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request');

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keys');

  const accessToken = req.headers[HEADER.AUTHORIZATION].split('Bearer ')[1];

  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user');

    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
});

export { authentication, createTokenPair };
