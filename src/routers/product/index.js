'use strict';

import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import productController from '../../controllers/product.controller.js';
import { asyncHandler } from '../../helpers/common.js';

const productRouter = express.Router();

productRouter.get('/search/:keyword', asyncHandler(productController.searchProductsByUser));
productRouter.use(authentication);

productRouter.post('/', asyncHandler(productController.createProduct));
productRouter.post('/publish/:product_id', asyncHandler(productController.publishProductByShop));
productRouter.post('/unpublish/:product_id', asyncHandler(productController.unpublishProductByShop));

//// QUERY ////
productRouter.get('/draft/all', asyncHandler(productController.getAllDraftProductsForShop));
productRouter.get('/published/all', asyncHandler(productController.getAllPublishedProductsForShop));

export default productRouter;
