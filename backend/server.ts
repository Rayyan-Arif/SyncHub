import dotenv from "dotenv";
dotenv.config();
import app from './app.js';
import './db.js';
import { gracefulShutdown } from "./utils/helper.js";

const server = app.listen(+(process.env.SERVER_PORT ?? 5000), "0.0.0.0", () => {
    console.clear();
    console.log(`Server started on port ${process.env.SERVER_PORT ?? 5000}`);
});

process.on('SIGTERM', gracefulShutdown(server));
process.on('SIGINT', gracefulShutdown(server));