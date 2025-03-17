'use strict';

import { Created, SuccessResponse } from '../core/success.response.js';
import ProductServices from '../services/product.service.js';
import { removeNullUndefinedProps } from '../utils/index.js';

class ProductController {
  static async createProduct(req, res) {
    const { product_type } = req.body;
    const product = await ProductServices.createProduct(product_type, { ...req.body, product_shop: req.user.userId });

    return new Created({
      message: 'Product created',
      metadata: product,
    }).send(res);
  }

  //////////////////////////////////////// PATCH ///////////////////////////////////
  static async updateProduct(req, res) {
    const updateData = removeNullUndefinedProps({
      ...req.body,
      product_shop: req.user.userId,
    });

    return new SuccessResponse({
      message: 'Update product success!',
      metadata: await ProductServices.updateProduct(req.params.product_id, updateData),
    }).send(res);
  }

  // static async getProduct(req, res) {
  //   try {
  //     const { product_id } = req.params;
  //     const product = await ProductServices.getProduct(product_id);

  //     if (!product) {
  //       throw new NotFoundError('Product not found');
  //     }

  //     return res.status(200).json({ product });
  //   } catch (error) {
  //     return res.status(error.status).json({ message: error.message });
  //   }
  // }

  //////////////////////////////////////// PUT ///////////////////////////////////////////
  static async publishProductByShop(req, res) {
    return new SuccessResponse({
      message: 'Product published successfully!',
      metadata: await ProductServices.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  }

  static async unpublishProductByShop(req, res) {
    return new SuccessResponse({
      message: 'Product unpublished successfully!',
      metadata: await ProductServices.unpublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  }

  /////////////////////////////////////// QUERY //////////////////////////////////////////
  /**
   * @description Get all draft products for shop
   * @param {*} req
   * @param {*} res
   */
  static async getAllDraftProductsForShop(req, res) {
    return new SuccessResponse({
      message: 'Get all draft products for shop success!',
      metadata: await ProductServices.findAllDraftProductsForShop({ product_shop: req.user.userId }),
    }).send(res);
  }

  static async getAllPublishedProductsForShop(req, res) {
    return new SuccessResponse({
      message: 'Get all Published products for shop success!',
      metadata: await ProductServices.findAllPublishProductsForShop({ product_shop: req.user.userId }),
    }).send(res);
  }

  static async searchProductsByUser(req, res) {
    return new SuccessResponse({
      message: 'Search products success!',
      metadata: await ProductServices.searchProductsByUser(req.params.keyword),
    }).send(res);
  }

  static async findAllProducts(req, res) {
    return new SuccessResponse({
      message: 'Get all products success!',
      metadata: await ProductServices.findAllProducts(req.query),
    }).send(res);
  }

  static async findProduct(req, res) {
    return new SuccessResponse({
      message: 'Get product success!',
      metadata: await ProductServices.findProduct({
        product_id: req.params.product_id,
        unselect: req.query.unselect.split(','),
      }),
    }).send(res);
  }
}

export default ProductController;
