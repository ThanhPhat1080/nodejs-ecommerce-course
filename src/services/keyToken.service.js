'use strict';

import KeyTokenModel from '../models/keyToken.model.js';

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // const token = await KeyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // });
      const filter = {
        user: userId
      }, update = {
        publicKey, privateKey,refreshTokensUsed: [],
        refreshToken
      }, options = {upsert: true,new: true}

      const tokens = await KeyTokenModel.findOneAndUpdate(filter,update, options)

      return tokens ? tokens.publicKey : null;
    } catch (error) {}
  };
}

export default KeyTokenService;
