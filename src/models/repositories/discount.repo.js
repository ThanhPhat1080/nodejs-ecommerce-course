'use strict';

import discountModel from '../../models/discount.model.js';
import { getSelectData, getUnselectData } from '../../utils/index.js';

export const findAllDiscountCodesUnSelect = async ({ filter, limit = 50, page = 1, sort = 'ctime', unselect }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnselectData(unselect))
    .lean()
    .exec();

  return { discounts, skip, limit, page, total: discounts.length };
};

export const findAllDiscountCodesSelect = async ({ filter, limit = 50, page = 1, sort = 'ctime', unselect }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(unselect))
    .lean()
    .exec();

  return { discounts, skip, limit, page, total: discounts.length };
};

export const checkDiscountExists = async (filter) => {
  return await discountModel.findOne(filter).lean().exec();
};
