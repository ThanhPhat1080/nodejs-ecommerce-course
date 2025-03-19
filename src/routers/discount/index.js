'use strict';

import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import discountController from '../../controllers/discount.controller.js';
import { asyncHandler } from '../../helpers/common.js';

const discountRouter = express.Router();

discountRouter.get('/list-product-code', asyncHandler(discountController.getAllDiscountCodesByShop));
discountRouter.get('/amount', asyncHandler(discountController.getDiscountAmount));

discountRouter.use(authentication);

discountRouter.post('/', asyncHandler(discountController.createDiscountCode));

export default discountRouter;
