'use strict'
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createTokenPair } from '../auth/authUtils';
import ShopModel from '../models/shop.model';
import KeyTokenService from '../services/keyToken.service';

const roleShop = {
  SHOP: 'SHOP',
  WRITE: 'WRITE',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({name, email, password}) => {
    try {
      const shopOwner = await ShopModel.findOne({email}).lean();
      if (shopOwner) {
        return {
          code: 'xxx',
          message: "Existing"
        }
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await ShopModel.create({
        name,
        email,
        password: passwordHash,
        roles: roleShop.SHOP
      });

      if(newShop) {
        const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          }
        })
        console.log('dddd', {privateKey, publicKey}); //save collection key store


        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey
        });

        if (!publicKeyString) {
          return {
            code: 'xxx',
            message: 'PublicKeyString error'
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString)
        const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyObject, privateKey)
        console.log('tokens', tokens);

        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens
          }
        }
      }

      return {code:200, metadata: null}
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

export default AccessService;
