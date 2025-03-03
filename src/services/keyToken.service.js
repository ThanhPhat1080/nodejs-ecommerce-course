'use strict';

import KeyTokenModel from '../models/keyToken.model.js';

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const token = await KeyTokenModel.create({
        user: userId,
        publicKey,
        privateKey
      });

      return token ? token.publicKey : null;
    } catch (error) {}
  };
}

export default KeyTokenService;
