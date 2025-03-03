'use strict';
import express from 'express';
import accessRouter from './access/index.js';

const router = express.Router();

// Check API Key
// router.use(apiKey);


// Check Permission


router.use('/v1/api', accessRouter)

export default router;
