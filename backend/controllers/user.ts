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
    const stats = (await pool.query("SELECT * FROM get_dashboard_stats();")).rows[0];

    res.status(200).send({
        status: 'success',
        data: {
            stats
        }
    });
});