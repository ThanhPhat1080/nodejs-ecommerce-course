'use strict';

import express from 'express';
import { authenticationV2 } from '../../auth/authUtils.js';
import AccessController from '../../controllers/access.controller.js';
import { asyncHandler } from '../../helpers/common.js';

const accessRouter = express.Router();

accessRouter.post('/shop/signup', asyncHandler(AccessController.signUp));
accessRouter.post('/shop/login', asyncHandler(AccessController.login));

accessRouter.use(authenticationV2);
accessRouter.post('/shop/logout', asyncHandler(AccessController.logout));
accessRouter.post('/shop/refresh-token', asyncHandler(AccessController.handleRefreshTokenV2));

export default accessRouter;
