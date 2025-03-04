'use strict';

import express from 'express';
import { asyncHandler } from '../../auth/checkAuth.js';
import accessController from '../../controllers/access.controller.js';

const accessRouter = express.Router();

accessRouter.post('/shop/signup', asyncHandler(accessController.signUp))
accessRouter.post('/shop/login', asyncHandler(accessController.login));

export default accessRouter;
