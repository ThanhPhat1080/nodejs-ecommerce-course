'use strict';

import express from 'express';
import { authenticationV2 } from '../../auth/authUtils.js';
import accessController from '../../controllers/access.controller.js';
import { asyncHandler } from '../../helpers/common.js';

const accessRouter = express.Router();

accessRouter.post('/shop/signup', asyncHandler(accessController.signUp));
accessRouter.post('/shop/login', asyncHandler(accessController.login));

accessRouter.use(authenticationV2);
accessRouter.post('/shop/logout', asyncHandler(accessController.logout));
accessRouter.post('/shop/refresh-token', asyncHandler(accessController.handleRefreshTokenV2));

export default accessRouter;
