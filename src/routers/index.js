'use strict';
import express from 'express';
import { apiKey, permission } from '../auth/checkAuth.js';
import accessRouter from './access/index.js';
import userCartRouter from './cart/index.js';
import discountRouter from './discount/index.js';
import productRouter from './product/index.js';

const router = express.Router();

// Check API Key
router.use(apiKey);
router.use(permission('0000'));

// Check Permission
router.use('/v1/api/user/cart', userCartRouter);
router.use('/v1/api/discount', discountRouter);
router.use('/v1/api', accessRouter);
router.use('/v1/api/product', productRouter);
export default router;
