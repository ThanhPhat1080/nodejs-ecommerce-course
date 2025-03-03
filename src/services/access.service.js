'use strict';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createTokenPair } from '../auth/authUtils.js';
import ShopModel from '../models/shop.model.js';
import KeyTokenService from '../services/keyToken.service.js';
import { getInfoData } from '../utils/index.js';

const roleShop = {
  SHOP: 'SHOP',
  WRITE: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const shopOwner = await ShopModel.findOne({ email }).lean();
      if (shopOwner) {
        return {
          code: 'xxx',
          message: 'Existing',
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await ShopModel.create({
        name,
        email,
        password: passwordHash,
        roles: roleShop.SHOP,
      });

      if (newShop) {
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
        console.log('dddd', { privateKey, publicKey }); //save collection key store

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: 'xxx',
            message: 'Store keys error',
          };
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
      }

      return { code: 500, metadata: null };
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      };
    }
  };
}

export default AccessService;
