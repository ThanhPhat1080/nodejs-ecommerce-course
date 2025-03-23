'use strict';

import { SuccessResponse } from '../core/success.response.js';
import DiscountService from '../services/discount.service.js';

class DiscountController {
  static async createNewDiscount(req, res) {
    return new SuccessResponse({
      message: 'Successful code generations',
      metadata: await DiscountService.createNewDiscount({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  }

  static async getAllDiscountCodes(req, res) {
    return new SuccessResponse({
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.query.shopId,
      }),
    }).send(res);
  }

  static async getAllDiscountCodesByShop(req, res) {
    return new SuccessResponse({
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  }

  static async getAllDiscountCodesWithProduct(req, res) {
    return new SuccessResponse({
      metadata: await DiscountService.getAllDiscountCodesWithProduct(req.query),
    }).send(res);
  }

  static async getDiscountAmount(req, res) {
    return new SuccessResponse({
      metadata: await DiscountService.getDiscountAmount(req.body),
    }).send(res);
  }
}

export default DiscountController;
