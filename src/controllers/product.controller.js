'use strict';

import { Created, SuccessResponse } from '../core/success.response.js';
import ProductServices from '../services/product.service.js';

class ProductController {
  static async createProduct(req, res) {
    const { product_type } = req.body;
    const product = await ProductServices.createProduct(product_type, { ...req.body, product_shop: req.user.userId });

    return new Created({
      message: 'Product created',
      metadata: product,
    }).send(res);
  }

  // static async getProduct(req, res) {
  //   try {
  //     const { product_id } = req.params;
  //     const product = ProductServices.getProduct(product_id);

  //     if (!product) {
  //       throw new NotFoundError('Product not found');
  //     }

  //     return res.status(200).json({ product });
  //   } catch (error) {
  //     return res.status(error.status).json({ message: error.message });
  //   }
  // }

  /////////////////////////////////////// QUERY //////////////////////////////////////////
  /**
   * @description Get all draft products for shop
   * @param {*} req
   * @param {*} res
   */
  static async getAllDraftProductsForShop(req, res) {
    new SuccessResponse({
      message: 'Get all draft products for shop success',
      metadata: await ProductServices.findAllDraftProductsForShop({ product_shop: req.user.userId }),
    }).send(res);
  }

  static async getAllPublishedProductsForShop(req, res) {
    new SuccessResponse({
      message: 'Get all Published products for shop success',
      metadata: await ProductServices.findAllPublishProductsForShop({ product_shop: req.user.userId }),
    }).send(res);
  }
}

export default ProductController;
