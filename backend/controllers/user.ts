import { catchAsync } from "../utils/error.js";
import type { Request, Response, NextFunction } from "express";
import pool from "../db.js";

export const getMe = catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.status(200).send({
        status: 'success',
        data: {
            user: req.user
        }
    });
});

export const getOwnerStats = catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const stats = (await pool.query(`
        SELECT
        (SELECT COUNT(*) FROM organization) AS organizations_created,
		(SELECT COUNT(*) FROM users WHERE user_role = 'USER') AS users_joined,
		(SELECT COUNT(*) FROM team) AS teams_created,
		(SELECT COUNT(*) FROM project) AS projects_started,
		(SELECT COUNT(*) FROM assigned_tasks) AS assigned_tasks;
    `)).rows[0];

    const usersThisWeek = (await pool.query("SELECT COUNT(*) AS users_joined, created_at FROM users WHERE user_role = 'USER' AND created_at >= CURRENT_DATE - 7 GROUP BY created_at ORDER BY created_at;")).rows;
    const usersThisMonth = (await pool.query("SELECT COUNT(*) AS users_joined, created_at FROM users WHERE user_role = 'USER' AND created_at >= CURRENT_DATE - 30 GROUP BY created_at ORDER BY created_at;")).rows;

    res.status(200).send({
        status: 'success',
        data: {
            stats: {
                ...stats,
                users_this_week: usersThisWeek,
                users_this_month: usersThisMonth
            }
        }
    });
});