'use strict';

import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import accessController from '../../controllers/access.controller.js';
import { asyncHandler } from '../../helpers/common.js';

const accessRouter = express.Router();

accessRouter.post('/shop/signup', asyncHandler(accessController.signUp));
accessRouter.post('/shop/login', asyncHandler(accessController.login));

accessRouter.use(authentication);
accessRouter.post('/shop/logout', asyncHandler(accessController.logout));
accessRouter.post('/shop/refresh-token', asyncHandler(accessController.handleRefreshToken));

export default accessRouter;
