'use strict';

import shopModel from '../models/shop.model.js';

class ShopService {
  static findByEmail = async ({ email, select = { email: 1, password: 1, name: 1, status: 1, roles: 1 } }) => {
    return shopModel.findOne({ email }).select(select).lean();
  };
}

export default ShopService;
