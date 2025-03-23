'use strict';

import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import ProductController from '../../controllers/product.controller.js';
import { asyncHandler } from '../../helpers/common.js';

const productRouter = express.Router();

productRouter.get('/search/:keyword', asyncHandler(ProductController.searchProductsByUser));
productRouter.get('/all', asyncHandler(ProductController.findAllProducts));
productRouter.get('/:product_id', asyncHandler(ProductController.findProduct));

productRouter.use(authentication);

productRouter.patch('/:product_id', asyncHandler(ProductController.updateProduct));
productRouter.post('/', asyncHandler(ProductController.createProduct));
productRouter.post('/publish/:product_id', asyncHandler(ProductController.publishProductByShop));
productRouter.post('/unpublish/:product_id', asyncHandler(ProductController.unpublishProductByShop));

//// QUERY ////
productRouter.get('/draft/all', asyncHandler(ProductController.getAllDraftProductsForShop));
productRouter.get('/published/all', asyncHandler(ProductController.getAllPublishedProductsForShop));

export default productRouter;
