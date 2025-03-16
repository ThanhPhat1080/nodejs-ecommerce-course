'use strict';

import { Created, SuccessResponse } from '../core/success.response.js';
import AccessService from '../services/access.service.js';

class AccessController {
  login = async (req, res) => {
    return new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res) => {
    return new Created({
      message: 'Registered success!',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  logout = async (req, res) => {
    const { keyStore } = req;

    return new SuccessResponse({
      message: 'Logout success!',
      metadata: await AccessService.logout(keyStore),
    }).send(res);
  };

  handleRefreshToken = async (req, res) => {
    return new SuccessResponse({
      message: 'Get token success!',
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    }).send(res);
  };

  handleRefreshTokenV2 = async (req, res) => {
    return new SuccessResponse({
      message: 'Get token success!',
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        keyStore: req.keyStore,
        user: req.user,
      }),
    }).send(res);
  };
}

const accessController = new AccessController();

export default accessController;
