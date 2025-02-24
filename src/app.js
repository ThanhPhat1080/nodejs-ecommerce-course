import compression from "compression";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import MongoDB from "./dbs/init.mongodb.js";
import checkConnect from "./helpers/check.connect.js";

dotenv.config();

const app = express();
// Express middlewares
app.use(express.json());

// Other middleware
app.use(process.env.NODE_ENV === "development" ? morgan("tiny") : morgan("common"));
app.use(helmet());
app.use(compression());

/* Init DB */
MongoDB.getInstance();
console.log("MongoDB connected: ", checkConnect.countConnect());
checkConnect.checkOverload();

/* Init routes */
app.get("/", (req, res) => {
    const stringCompress = "Hello World";

    return res.status(200).json({
        message: "Hello World",
        stringCompress: stringCompress.repeat(100000),
    });
});

/* Handling errors */

export default app;