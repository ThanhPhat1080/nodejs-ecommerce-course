'use strict';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import JWT from 'jsonwebtoken';
import { createTokenPair } from '../auth/authUtils.js';
import { AuthFailureError, BadRequestError, ForbiddenError } from '../core/error.response.js';
import ShopModel from '../models/shop.model.js';
import KeyTokenService from '../services/keyToken.service.js';
import { getInfoData } from '../utils/index.js';
import ShopService from './shop.service.js';

const roleShop = {
  SHOP: 'SHOP',
  WRITE: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await ShopService.findByEmail({ email });

    if (!foundShop) {
      throw new BadRequestError('Shot not registered!');
    }

    const match = bcrypt.compare(password, foundShop.password);

    if (!match) {
      throw new AuthFailureError('Authentication Error');
    }

    // Pass email/password -> create token
    const typedArray = new Uint32Array(10);
    const privateKey = crypto.getRandomValues(typedArray).toString('hex');
    const publicKey = crypto.getRandomValues(typedArray).toString('hex');

    const { _id: userId } = foundShop;
    const tokens = createTokenPair({
      payload: { userId, email },
      publicKey,
      privateKey,
    });

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      userId,
      publicKey,
      privateKey,
    });

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    try {
      const shopOwner = await ShopModel.findOne({ email }).lean();
      if (shopOwner) {
        throw new BadRequestError('Error: Shop already registered!');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await ShopModel.create({
        name,
        email,
        password: passwordHash,
        roles: roleShop.SHOP,
      });

      if (!newShop) {
        throw new BadRequestError('Error: Cannot register!');
      }

      /**
       * Create Key in Advance way
       */
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // });

      /**
       * Create Key in Basic way
       */
      const typedArray = new Uint32Array(10);
      const privateKey = crypto.getRandomValues(typedArray).toString('hex');
      const publicKey = crypto.getRandomValues(typedArray).toString('hex');

      // Save collection key store
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError('Error: Cannot register!');
      }

      const tokens = createTokenPair({
        payload: { userId: newShop._id, email },
        publicKey,
        privateKey,
      });

      return {
        code: 201,
        metadata: {
          shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokens,
        },
      };
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      };
    }
  };

  static logout = async (keyStore) => {
    const deleteKey = await KeyTokenService.removeKeyById(keyStore._id);

    return deleteKey;
  };

  /**
   * Check token used
   * @param {*} refreshToken
   */
  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      const { userId } = JWT.verify(refreshToken, foundToken.privateKey);

      // Xoa

      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something went wrong !! Please re-login');
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError('Shop not register');

    // verify token
    const { email, userId } = JWT.verify(refreshToken, holderToken.privateKey);
    const foundShop = await ShopService.findByEmail({ email });

    if (!foundShop) {
      throw new BadRequestError('Shot not registered!');
    }

    // Create new token
    const tokens = createTokenPair({
      payload: { userId, email },
      publicKey: holderToken.publicKey,
      privateKey: holderToken.privateKey,
    });

    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: {
        userId,
        email,
      },
      tokens,
    };
  };
}

export default AccessService;
