import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import teamRouter from "./routes/teamRouter.js";
import projectRouter from "./routes/projectRouter.js";
import taskRouter from "./routes/taskRouter.js";
import announcementRouter from "./routes/announcementRouter.js";
import organizationRouter from "./routes/organizationRouter.js";

const app = express();

//logging
app.use(morgan("dev"));

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        status: 'fail',
        statusCode: 429,
        message: "Too many requests, please try again later."
    }
}));

app.use(cookieParser());
app.use(express.json({limit: '10kb'}));

//security
app.use([xss(), helmet()]);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/organizations", organizationRouter);
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/announcements", announcementRouter);

app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Route not found.'
    });
});

export default app;