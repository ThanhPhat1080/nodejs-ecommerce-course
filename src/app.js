import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";


dotenv.config();

const app = express();


/* Init middleware */
// Express middlewares
app.use(express.json());

// Other middleware
app.use(process.env.NODE_ENV === "development" ? morgan("tiny") : morgan("common"));
app.use(helmet());
app.use(compression());

/* Init DB */

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