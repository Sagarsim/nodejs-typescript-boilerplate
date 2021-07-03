import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import log from "./logger";
import config from "config";
import routes from "./routes";
createConnection().then(async connection => {
    log.info("Database connected");
    const port = config.get("port") as number;
    const host = config.get("host") as string;
    // create express app
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/", routes)
    // start express server
    app.listen(port, host, () => {
        log.info("Server running on port " + port)
    });
    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err)
        }
        res.status(err.status || 500);
        res.json({ status: 0, message: err.message, error: err.error });
    })
}).catch(error => console.log(error));
