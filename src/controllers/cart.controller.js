'use strict';

import { SuccessResponse } from '../core/success.response.js';
import CartService from '../services/cart.service.js';

class CartController {
  /**
   * @description Add product to cart
   */
  static async addToCard(req, res) {
    return new SuccessResponse({
      message: 'Add product to cart success!',
      metadata: await CartService.addProductToCart(req.body),
    }).send(res);
  }

  /**
   * @description Update product in cart
   */
  static async updateProductInCart(req, res) {
    return new SuccessResponse({
      message: 'Update product in cart success!',
      metadata: await CartService.updateProductQuantityInCart(req.body),
    }).send(res);
  }

  /**
   * @description Delete product in cart
   */
  static async deleteProductInCart(req, res) {
    return new SuccessResponse({
      message: 'Delete product in cart success!',
      metadata: await CartService.deleteProductInCard(req.body),
    }).send(res);
  }

  /**
   * @description Get cart
   */
  static async getCart(req, res) {
    return new SuccessResponse({
      message: 'Get cart success!',
      metadata: await CartService.getCart(req.query),
    }).send(res);
  }
}

export default CartController;
