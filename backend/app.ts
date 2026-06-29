import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import teamRouter from "./routes/teamRouter.js";
import projectRouter from "./routes/projectRouter.js";
import taskRouter from "./routes/taskRouter.js";
import organizationRouter from "./routes/organizationRouter.js";

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/organizations", organizationRouter);
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);

app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Route not found.'
    });
});

export default app;