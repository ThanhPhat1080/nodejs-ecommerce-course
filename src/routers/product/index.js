'use strict';

import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import productController from '../../controllers/product.controller.js';
import { asyncHandler } from '../../helpers/common.js';

const productRouter = express.Router();

productRouter.use(authentication);
productRouter.post('/', asyncHandler(productController.createProduct));

export default productRouter;
