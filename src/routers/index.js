'use strict';
import express from 'express';
import { apiKey, permission } from '../auth/checkAuth.js';
import accessRouter from './access/index.js';

const router = express.Router();

// Check API Key
router.use(apiKey);
router.use(permission('0000'));

// Check Permission

router.use('/v1/api', accessRouter);

export default router;
