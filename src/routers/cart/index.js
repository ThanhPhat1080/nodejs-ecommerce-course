'use strict';

import express from 'express';
import CartController from '../../controllers/cart.controller.js';
import { asyncHandler } from '../../helpers/common.js';

const cartRouter = express.Router();

cartRouter.get('/', asyncHandler(CartController.getCart));
cartRouter.post('/add-to-cart', asyncHandler(CartController.addToCard));
cartRouter.post('/', asyncHandler(CartController.updateProductInCart));
cartRouter.delete('/delete', asyncHandler(CartController.deleteProductInCart));

export default cartRouter;
