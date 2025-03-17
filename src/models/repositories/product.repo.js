'use strict';

import { Types } from 'mongoose';
import { getSelectData, getUnselectData } from '../../utils/index.js';
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

export const unpublishProductByShop = async ({ product_id, product_shop }) => {
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

export const searchProducts = async (keyword, { isPublished = true, isDraft = false }) => {
  const regexKeyword = new RegExp(keyword, 'i');

  return await productModel
    .find(
      {
        isPublished,
        isDraft,
        $text: { $search: regexKeyword },
      },
      { score: { $meta: 'textScore' } },
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean()
    .exec();
};

export const findAllProducts = async ({
  select = [],
  limit = 50,
  sort = 'ctime',
  page = 1,
  filter = { isPublished: true },
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const product = await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();

  return { product, skip, limit, page, total: product.length };
};

export const findProduct = async ({ product_id, unselect = [] }) => {
  return await productModel.findById(product_id).select(getUnselectData(unselect)).lean().exec();
};

export const updateProductById = async ({ product_id, payload, model, isNew = true }) => {
  return await model.findByIdAndUpdate(product_id, payload, { new: isNew }).lean().exec();
};
