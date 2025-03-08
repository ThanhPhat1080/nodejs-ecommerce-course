'use strict';

import { Types } from 'mongoose';
import { default as keyTokenModel, default as KeyTokenModel } from '../models/keyToken.model.js';

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // const token = await KeyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // });
      const filter = {
          user: userId,
        },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;
    } catch (error) {}
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: Types.ObjectId(userId) }).lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.remove(id);
  };
}

export default KeyTokenService;
