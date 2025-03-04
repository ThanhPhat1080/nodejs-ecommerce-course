'use strict'

import { Created, SuccessResponse } from "../core/success.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
  login = async (req, res) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  signUp = async (req, res) => {
    return new Created({
      message: "Registered success!",
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  }
}

const accessController = new AccessController();

export default accessController;
