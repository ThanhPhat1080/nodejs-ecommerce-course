'use strict'

import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import MongoDB from './dbs/init.mongodb.js';
import router from './routers/index.js';

dotenv.config();

const app = express();
// Express middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Other middleware
app.use(process.env.NODE_ENV === 'development' ? morgan('tiny') : morgan('common'));
app.use(helmet());
app.use(compression());

/* Init DB */
MongoDB.getInstance();
// checkConnect.checkOverload();

/* Init routes */
app.use(router);

/* Handling errors */
app.use((req,res, next) => {
  const error = new Error('Not Found!')
  error.status = 404;

  next(error);
})

app.use((error, req,res, next) => {
 const status = error.status || 500
  return res.status(status).json({
    status: 'Error',
    statusCode: status,
    message: error.message || 'Internal Server Error!'
  })
})

export default app;
