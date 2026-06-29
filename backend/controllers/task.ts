import Express from "express";
import { AppError, catchAsync } from "../utils/error.js";
import pool from "../db.js";

export const createTask = catchAsync(async(req, res, next) => {
    const {title, description, project_id} = req.body;

    if(!title || !description || !project_id)
        throw new AppError("Please provide complete details for task.", 400);

    await pool.query("INSERT INTO task (title, description, project_id) VALUES ($1, $2, $3);", [title, description, project_id]);

    res.status(201).send({status: 'success'});
});

export const removeTask = catchAsync(async(req, res, next) => {
    const {task_id, project_id} = req.body;

    if(!task_id || !project_id)
        throw new AppError("Please provide a task to delete.", 400);

    const result = await pool.query("DELETE FROM task WHERE task_id = $1 AND project_id = $2;", [task_id, project_id]);

    if(!result.rowCount)
        throw new AppError("Task not found.", 404);

    res.status(204).send({});
});