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

export default app;
