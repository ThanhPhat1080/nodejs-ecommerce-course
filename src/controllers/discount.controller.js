'use strict';

import { SuccessResponse } from '../core/success.response.js';
import discountService from '../services/discount.service.js';

class DiscountController {
  static async createNewDiscount(req, res) {
    return new SuccessResponse({
      message: 'Successful code generations',
      metadata: await discountService.createNewDiscount({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  }

  static async getAllDiscountCodes(req, res) {
    return new SuccessResponse({
      metadata: await discountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.query.shopId,
      }),
    }).send(res);
  }

  static async getAllDiscountCodesByShop(req, res) {
    return new SuccessResponse({
      metadata: await discountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  }

  static async getAllDiscountCodesWithProduct(req, res) {
    return new SuccessResponse({
      metadata: await discountService.getAllDiscountCodesWithProduct(req.query),
    }).send(res);
  }

  static async getDiscountAmount(req, res) {
    return new SuccessResponse({
      metadata: await discountService.getDiscountAmount(req.body),
    }).send(res);
  }
}

export default DiscountController;
