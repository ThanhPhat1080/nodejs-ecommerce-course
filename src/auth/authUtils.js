'use strict';

import JWT from 'jsonwebtoken';

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

export { createTokenPair };
