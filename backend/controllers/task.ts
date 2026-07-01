import Express from "express";
import { AppError, catchAsync } from "../utils/error.js";
import pool from "../db.js";

export const createTask = catchAsync(async(req, res, next) => {
    const {title, description, project_id} = req.body;

    if(!title || !description || !(+project_id))
        throw new AppError("Please provide complete details for task.", 400);

    await pool.query("INSERT INTO task (title, description, project_id) VALUES ($1, $2, $3);", [title, description, project_id]);

    res.status(201).send({status: 'success'});
});

export const removeTask = catchAsync(async(req, res, next) => {
    const {task_id, project_id} = req.body;

    if(!(+task_id) || !(+project_id))
        throw new AppError("Please provide a task to delete.", 400);

    const result = await pool.query("DELETE FROM task WHERE task_id = $1 AND project_id = $2;", [task_id, project_id]);

    if(!result.rowCount)
        throw new AppError("Task not found.", 404);

    res.status(204).send({});
});

export const assignTaskToMember = catchAsync(async(req, res, next) => {
    const {task_id, member_id, due_date} = req.body;

    if(!(+task_id) || !(+member_id) || !due_date)
        throw new AppError("Please provide complete details for task assignment.", 400);

    await pool.query("INSERT INTO assigned_tasks (task_id, member_id, due_date) VALUES ($1, $2, $3);", [task_id, member_id, due_date]);

    res.status(200).send({status: 'success'});
});

export const unassignTaskFromMember = catchAsync(async(req, res, next) => {
    const {task_id, member_id} = req.body;

    if(!(+task_id) || !(+member_id))
        throw new AppError("Please provide complete details to unassign task.", 400);

    const result = await pool.query("DELETE FROM assigned_tasks WHERE task_id = $1 AND member_id = $2;", [task_id, member_id]);

    if(!result.rowCount)
        throw new AppError("No such task assigned to the member.", 404);

    res.status(204).send({});
});

export const generateReportForManager = catchAsync(async(req, res, next) => {
    const {organization_id} = req.body;

    const report = (await pool.query(`
        WITH task_view AS (
            SELECT * FROM assigned_tasks WHERE task_id IN
            (
                SELECT task_id FROM task WHERE project_id IN
                (
                    SELECT project_id FROM project WHERE team_id IN
                    (
                        SELECT team_id FROM team WHERE manager_id = $1 AND organization_id = $2
                    )
                )
            )
        )
        SELECT u.user_id, u.user_name, u.user_email, COUNT(DISTINCT(tv1.task_id)) AS tasks_assigned, COUNT(DISTINCT(tv2.task_id)) AS tasks_in_progress, COUNT(DISTINCT(tv3.task_id)) AS tasks_completed, COUNT(DISTINCT(tv4.task_id)) AS tasks_missed FROM users u
        LEFT JOIN task_view tv1 ON tv1.member_id = u.user_id 
        LEFT JOIN task_view tv2 ON tv2.member_id = u.user_id AND tv2.status = 'IN PROGRESS'
        LEFT JOIN task_view tv3 ON tv3.member_id = u.user_id AND tv3.status = 'COMPLETED'
        LEFT JOIN task_view tv4 ON tv4.member_id = u.user_id AND tv4.status != 'COMPLETED' AND tv4.due_date < CURRENT_DATE
        GROUP BY u.user_id, u.user_name, u.user_email;
    `, [req.user.user_id, organization_id])).rows;

    res.status(200).send({
        status: 'success',
        data: {
            report
        }
    });
});

export const updateTaskStatus = catchAsync(async(req, res, next) => {
    const {task_id, member_id, status} = req.body;

    if(!(+task_id) || !(+member_id))
        throw new AppError("Please provide a member and task to update status.", 400);

    if(status !== 'IN PROGRESS' && status !== 'COMPLETED')
        throw new AppError("This task status is invalid.", 400);

    const result = (await pool.query("UPDATE assigned_tasks SET status = $1 WHERE task_id = $2 AND member_id = $3", [status, task_id, member_id]));

    if(!result.rowCount)
        throw new AppError("No such task has been assigned.", 404);

    res.send(200).send({
        status: 'success'
    });
});

export const getAssignedTasks = catchAsync(async(req, res, next) => {
    const {project_id} = req.body;

    if(!(+project_id))
        throw new AppError("Please provide a project to get its assigned tasks.", 400);

    const assignedTasks = (await pool.query(`
        SELECT t.task_id, t.title, t.description, ast.assigned_date, ast.due_date, ast.status FROM 
        (
            SELECT * FROM task WHERE project_id = 
            (
                SELECT project_id FROM project_enrollment WHERE member_id = $1 AND project_id = $2
            )
        ) t 
        JOIN 
        (
            SELECT * FROM assigned_tasks WHERE member_id = $1
        ) ast ON t.task_id = ast.task_id;    
    `, [req.user.user_id, project_id])).rows;

    res.status(200).send({
        status: 'success',
        data: {
            assignedTasks
        }
    });
});