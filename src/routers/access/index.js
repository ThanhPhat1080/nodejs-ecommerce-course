'use strict';

import express from 'express';
import { asyncHandler } from '../../auth/checkAuth.js';
import accessController from '../../controllers/access.controller.js';

const accessRouter = express.Router();


// signup
accessRouter.post('/shop/signup', asyncHandler(accessController.signUp))

export default accessRouter;
