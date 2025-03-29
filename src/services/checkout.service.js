'use strict';
import { BadRequestError } from '../core/error.response.js';
import OrderModel from '../models/order.model.js';
import * as CartRepo from '../models/repositories/cart.repo.js';
import * as ProductRepo from '../models/repositories/product.repo.js';
import DiscountService from './discount.service.js';
import { acquireLock, releaseLock } from './redis.service.js';
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
          itemProducts: getCorrectInfoProductInCart,
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
        acc.finalCheckoutOrder.push(itemCheckout);

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
        finalCheckoutOrder: [],
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

  static async orderByUser({ orders, cartId, userId, userAddress = {}, userPayment = {}, metadata = {} }) {
    // Step 1: Review the checkout details
    const { totalPrice, feeShip, totalDiscount, totalPayment, finalCheckoutOrder } = await this.checkoutReview({
      userId,
      cartId,
      orders,
    });

    // Step 2: Validate product stock and acquire locks
    const products = finalCheckoutOrder.flatMap((order) => order.itemProducts);
    await this.validateAndLockProducts(products, cartId);

    // Step 3: Create the order
    const newOrder = await this.createOrder({
      userId,
      finalCheckoutOrder,
      userAddress,
      userPayment,
      totalPrice,
      feeShip,
      totalDiscount,
      totalPayment,
      metadata,
    });

    // Step 4: Remove purchased products from the cart
    await this.removePurchasedProductsFromCart({ cartId, products });

    return newOrder;
  }

  /**
   * Step 2: Validate product stock and acquire locks
   */
  static async validateAndLockProducts(products, cartId) {
    let acquireProducts = [];

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const isLocking = await acquireLock({ productId, quantity, cartId });

      acquireProducts.push(isLocking ? true : false);
      if (isLocking) {
        await releaseLock(isLocking);
      }
    }

    if (acquireProducts.includes(false)) {
      throw new BadRequestError('Some products could not be locked. Please try again.');
    }
  }

  /**
   * Step 3: Create the order
   */
  static async createOrder({
    userId,
    finalCheckoutOrder,
    userAddress,
    userPayment,
    totalPrice,
    feeShip,
    totalDiscount,
    totalPayment,
    metadata,
  }) {
    // Prepare the order data
    const orderData = {
      order_user_id: userId,
      order_checkout: {
        total_price: totalPrice, // Total price before discounts
        total_discount: totalDiscount, // Total discount applied
        fee_ship: feeShip, // Shipping fee
        total_payment: totalPayment, // Final payment amount
      },
      order_shipping: {
        full_name: userAddress.full_name,
        phone: userAddress.phone,
        street: userAddress.street,
        city: userAddress.city,
        state: userAddress.state,
        country: userAddress.country,
        postal_code: userAddress.postal_code,
      },
      order_payment: {
        method: userPayment.method,
        status: userPayment.status || 'pending', // Default to 'pending' if not provided
        transaction_id: userPayment.transaction_id || null, // Optional transaction ID
      },
      order_products: finalCheckoutOrder.flatMap((order) =>
        order.itemProducts.map((product) => ({
          product_id: product.productId,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
        })),
      ),
      order_tracking_number: `#${Date.now()}`, // Generate a unique tracking number
      order_status: 'pending', // Default order status
      order_notes: metadata.notes || '', // Optional notes
    };

    // Create the order in the database
    return await OrderModel.create(orderData);
  }

  /**
   * Step 4: Remove purchased products from the cart
   */
  static async removePurchasedProductsFromCart({ cartId, products }) {
    const productIds = products.map((product) => product.productId); // Get the list of purchased product IDs
    await CartRepo.removeProductsFromCart({ cartId, productIds }); // Call the repository to remove products
  }
}

export default CheckoutService;
