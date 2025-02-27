'use strict'

import KeyTokenModel from '../models/keyToken.model';

class KeyTokenService {
  // PublicKey: buffer
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyStr = publicKey.toString()
      const token = await KeyTokenModel.create({
        user: userId,
        publicKey: publicKeyStr,
      })

      return token? token.publicKey:null;
    } catch (error) {

    }
  }
}

export default KeyTokenService
