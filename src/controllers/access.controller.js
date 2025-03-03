'use strict'

import { Created } from "../core/success.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
  signUp = async (req, res) => {
    return new Created({
      message: "Registered success!",
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  }
}

const accessController = new AccessController();

export default accessController;
