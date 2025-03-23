'use strict';
import { BadRequestError } from '../core/error.response.js';
import * as CartRepo from '../models/repositories/cart.repo.js';
import * as ProductRepo from '../models/repositories/product.repo.js';
/**
 * Key features of the Cart Service:
 * 1 - Add product to cart
 * 1.1 - Reduce product quantity in stock
 * 2 - Update product quantity in cart
 * 3 - Remove product from cart
 * 4 - Get all products in cart
 * 5 - Get total price of all products in cart
 * 6 - Clear cart
 */

class CartService {
  static async addProductToCart({ userId, product }) {
    // 1 - Add product to cart
    // 1.1 - Check cart exists or not. If not, create cart and add product to cart.
    // 1.3 - Reduce product quantity in stock
    const foundUserCart = await CartRepo.findUserCart({ userId });
    if (!foundUserCart) {
      return await CartRepo.createUserCartWithProduct({ userId, product });
    }

    // Add or update product in cart.
    return await CartRepo.updateUserCartProductQuantity({ userId, product });
  }

  static async updateProductQuantityInCart({ userId, product }) {
    const { productId, newQuantity, oldQuantity } = product;

    const foundProduct = await ProductRepo.findProduct({ product_id: productId });
    if (!foundProduct) {
      throw new BadRequestError('Product not found!');
    }

    if (newQuantity === 0) {
      // delete
      return await CartRepo.deleteProductInCard({ userId, productId });
    }

    return await CartRepo.updateUserCartProductQuantity({
      product: {
        ...product,
        quantity: newQuantity - oldQuantity,
      },
      userId,
    });
  }

  static deleteProductInCard({ userId, productId }) {
    // Delete product in cart
    return CartRepo.deleteProductInCard({ userId, productId });
  }

  static async getCart({ userId }) {
    // 4 - Get cart details
    return await CartRepo.findUserCart({ userId });
  }
}

export default CartService;
