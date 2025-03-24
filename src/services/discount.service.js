'use strict';
import { BadRequestError, NotFoundError } from '../core/error.response.js';
import discountModel from '../models/discount.model.js';
import { checkDiscountExists, findAllDiscountCodesUnSelect } from '../models/repositories/discount.repo.js';
import { findAllProducts } from '../models/repositories/product.repo.js';
import { convertToMongooesObjectId } from '../utils/index.js';

/**
 * Discount Service
 *
 * 1 - Generator discount code [Shop | Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount code [Shop | Admin]
 * 6 - Cancel discount code [User]
 */

class DiscountService {
  static async createNewDiscount({
    discount_name,
    discount_description,
    discount_type,
    discount_value,
    discount_code,
    discount_start_date,
    discount_end_date,
    discount_max_uses,
    discount_uses_count,
    discount_users_used,
    discount_max_uses_per_user,
    discount_min_order_value,
    shopId,
    discount_is_active,
    discount_applies_to = 'all',
    productIds,
  }) {
    if (new Date(discount_start_date) > new Date(discount_end_date)) {
      throw new BadRequestError('"Start Date" must be before "End Date"!');
    }
    const foundDiscount = await checkDiscountExists({
      discount_code,
      discount_shopId: convertToMongooesObjectId(shopId),
    });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount code is already exists!');
    }

    const newDiscount = await discountModel.create({
      discount_name,
      discount_description,
      discount_type,
      discount_code,
      discount_value,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_uses,
      discount_uses_count,
      discount_users_used,
      discount_max_uses_per_user,
      discount_min_order_value: discount_min_order_value || 0,
      discount_shopId: convertToMongooesObjectId(shopId),
      discount_is_active,
      discount_applies_to,
      discount_product_ids: discount_applies_to === 'all' ? [] : productIds,
    });

    return newDiscount;
  }

  /**
   * TODO: rename function
   * Get all published products by discount code
   * @param {Object} param0
   * @returns
   */
  static async getAllDiscountCodesWithProduct({ discountCodeId, shopId, limit, page }) {
    const foundDiscount = await discountModel
      .find({
        discount_code: discountCodeId,
        discount_shopId: convertToMongooesObjectId(shopId),
      })
      .lean()
      .exec();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not found or not active!');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let productFilter =
      discount_applies_to === 'all'
        ? {
            product_shop: convertToMongooesObjectId(shopId),
            isPublished: true,
          }
        : {
            _id: { $in: discount_product_ids },
            isPublished: true,
          };

    // Get all products
    const products = await findAllProducts({
      filter: productFilter,
      limit: +limit,
      page: +page,
      sort: 'ctime',
      select: ['product_name'],
    });

    return { products, discount: foundDiscount };
  }

  /**
   * Get all discount code of shop
   * @param {*} param0
   * @returns
   */
  static async getAllDiscountCodesByShop({ shopId, limit, page }) {
    const discounts = await findAllDiscountCodesUnSelect({
      filter: {
        discount_shopId: convertToMongooesObjectId(shopId),
        discount_is_active: true,
      },
      limit,
      page,
      unselect: ['__v', 'discount_shopId'],
    });

    return discounts;
  }

  /**
   * Apply discount code to order
   */
  static async getDiscountAmount({ discountCodeId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      discount_code: discountCodeId,
      discount_shopId: convertToMongooesObjectId(shopId),
    });

    if (!foundDiscount) {
      throw new NotFoundError('Discount code not found!');
    }

    const {
      discount_type,
      discount_value,
      discount_max_uses,
      discount_uses_count,
      discount_min_order_value,
      discount_is_active,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new BadRequestError('Discount code is not active!');
    }

    const isExpired =
      new Date() > new Date(foundDiscount.discount_end_date) ||
      new Date() > new Date(foundDiscount.discount_end_date) ||
      !discount_max_uses ||
      discount_max_uses <= discount_uses_count;
    if (isExpired) {
      throw new BadRequestError('Discount code is expired!');
    }

    // Check gia tri toi thieu
    let totalOrderPrice = 0;
    if (discount_min_order_value > 0) {
      totalOrderPrice = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      if (totalOrderPrice < discount_min_order_value) {
        throw new BadRequestError(
          'Order value is too low! Discount requires a minium order value of ' + discount_min_order_value,
        );
      }
    }

    // Check discount amount
    const amount = discount_type === 'fixed_amount' ? discount_value : (totalOrderPrice * discount_value) / 100;

    return {
      totalOrderPrice,
      discountAmount: amount,
      totalPrice: totalOrderPrice - amount,
    };
  }

  static async deleteDiscountCode({ discountCodeId, shopId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: discountCodeId,
      discount_shopId: convertToMongooesObjectId(shopId),
    });

    return deleted;
  }

  /**
   * Cancel
   * @param {*} param0
   * @returns
   */
  static async cancelDiscountCode({ discountCodeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      discount_code: discountCodeId,
      discount_shopId: convertToMongooesObjectId(shopId),
    });

    if (!foundDiscount) {
      throw new NotFoundError('Discount code not found!');
    }

    if (!foundDiscount.discount_users_used.includes(userId)) {
      throw new BadRequestError('Discount code is not used by user!');
    }

    const updated = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: { discount_users_used: userId },
      $inc: { discount_uses_count: -1, discount_max_uses: 1 },
    });

    return updated;
  }
}

export default DiscountService;
