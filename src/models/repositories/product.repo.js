'use strict';

import { Types } from 'mongoose';
import { productModel } from '../product.model.js';

export const findAllDraftProductsForShop = async ({ product_shop, limit, skip }) => {
  return await queryProducts({ query: { isDraft: true, product_shop }, limit, skip });
};

export const findAllPublishProductsForShop = async ({ product_shop, limit, skip }) => {
  return await queryProducts({ query: { isPublished: true, product_shop }, limit, skip });
};

export const queryProducts = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
};

export const publishProductByShop = async ({ product_id, product_shop }) => {
  const foundProduct = await productModel.findOne({
    _id: new Types.ObjectId(product_id.toString()),
    product_shop: new Types.ObjectId(product_shop.toString()),
  });

  if (!foundProduct) {
    return null;
  }

  foundProduct.isPublished = true;
  foundProduct.isDraft = false;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};
