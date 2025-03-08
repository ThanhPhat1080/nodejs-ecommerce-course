'use strict';

import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import accessController from '../../controllers/access.controller.js';
import { asyncHandler } from '../../helpers/common.js';
import router from '../index.js';

const accessRouter = express.Router();

accessRouter.post('/shop/signup', asyncHandler(accessController.signUp));
accessRouter.post('/shop/login', asyncHandler(accessController.login));

router.use(authentication);
accessRouter.post('/shop/logout', asyncHandler(accessController.logout));

export default accessRouter;
