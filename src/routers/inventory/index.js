'use strict';

import express from 'express';
import { authenticationV2 } from '../../auth/authUtils.js';
import InventoryController from '../../controllers/inventory.controller.js';
import { asyncHandler } from '../../helpers/common.js';
const inventoryRouter = express.Router();

inventoryRouter.use(authenticationV2);

inventoryRouter.post('/add-stock', asyncHandler(InventoryController.addProductStock));

export default inventoryRouter;
