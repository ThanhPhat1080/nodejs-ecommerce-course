'use strict';

import express from 'express';
import { authenticationV2 } from '../../auth/authUtils.js';
import DiscountController from '../../controllers/discount.controller.js';
import { asyncHandler } from '../../helpers/common.js';

const discountRouter = express.Router();

discountRouter.get('/', asyncHandler(DiscountController.getAllDiscountCodes));
discountRouter.get('/amount', asyncHandler(DiscountController.getDiscountAmount));

discountRouter.use(authenticationV2);

discountRouter.post('/', asyncHandler(DiscountController.createNewDiscount));

export default discountRouter;
