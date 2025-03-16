'use strict';

import { Types } from 'mongoose';
import { default as KeyTokenModel } from '../models/keyToken.model.js';

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
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

    const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options).lean();

    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await KeyTokenModel.findOne({ user: new Types.ObjectId(userId.toString()) });
  };

  static removeKeyById = async (id) => {
    return await KeyTokenModel.remove(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await KeyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await KeyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await KeyTokenModel.findOneAndDelete({ user: userId }).lean();
  };
}

export default KeyTokenService;
