'use strict';
import { BadRequestError } from '../core/error.response.js';
import * as CartRepo from '../models/repositories/cart.repo.js';
import * as ProductRepo from '../models/repositories/product.repo.js';
import DiscountService from './discount.service.js';

class CheckoutService {
  /**
  User may login or not.
  {
    cartId?,
    userId?,
    orders: [
      {
        shopId,
        shopDiscountCodes: ["1234ABC"],
        itemProducts : [{
          price,
          quantity,
          productId
        }]
      }
    ]
  }

   */
  static async checkoutReview({ userId, cartId, orders }) {
    // 1- Check Cart exist or not
    const foundCard = await CartRepo.findCartById(cartId);

    if (!foundCard) {
      throw new BadRequestError('Cart does not exist!');
    }

    return orders.reduce(
      async (acc, orderItem) => {
        const { shopId, shopDiscountCodes, itemProducts = [] } = orderItem;

        const getCorrectInfoProductInCart = await this.getOrderProductInfo(itemProducts);
        if (getCorrectInfoProductInCart.some((item) => item === null)) {
          throw new BadRequestError('Wrong order. Please try again!');
        }

        /**
         * Calculate total price
         */
        const productInShopPrice = getCorrectInfoProductInCart.reduce(
          (total, product) => total + product.price * product.quantity,
          0,
        );
        acc.totalPrice += productInShopPrice;

        let itemCheckout = {
          shopId,
          shopDiscountCodes,
          priceRaw: productInShopPrice,
          discount: 0,
          priceAfterDiscount: productInShopPrice,
        };

        /**
         * Calculate total discount amount
         */
        const productInShopDiscountAmount = (
          await Promise.all(
            shopDiscountCodes.map(async (discountCode) => {
              const discountAmount = await DiscountService.getDiscountAmount({
                discountCode: discountCode,
                shopId,
                products: getCorrectInfoProductInCart,
              });

              return discountAmount;
            }),
          )
        ).reduce((total, discount) => total + discount.discountAmount, 0);
        acc.totalDiscount += productInShopDiscountAmount;

        // Update the final order to be announce to user
        itemCheckout = {
          ...itemCheckout,
          discount: productInShopDiscountAmount,
          priceAfterDiscount: productInShopPrice - productInShopDiscountAmount,
        };
        acc.finalOrders.push(itemCheckout);

        /**
         * Calculate total payment
         */
        acc.totalPayment += productInShopPrice - productInShopDiscountAmount;

        return acc;
      },
      {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalPayment: 0,
        finalOrders: [],
      },
    );
  }

  static getOrderProductInfo(products) {
    return Promise.all(
      products.map(async ({ productId, quantity }) => {
        const foundProduct = await ProductRepo.findProduct({ product_id: productId });

        if (!foundProduct) {
          return null;
        }

        return {
          productId: foundProduct._id,
          price: foundProduct.product_price,
          quantity,
          name: foundProduct.product_name,
        };
      }),
    );
  }
}

export default CheckoutService;
