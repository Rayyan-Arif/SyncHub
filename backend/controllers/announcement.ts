import Express from "express";
import { AppError, catchAsync } from "../utils/error.js";
import pool from "../db.js";

export const createAnnouncement = catchAsync(async(req, res, next) => {
    const {announcement, team_id, project_id} = req.body;

    if(!announcement)
        throw new AppError("Please provide an announcement.", 400);

    if(!team_id && !project_id)
        throw new AppError("Please provide either team or project for this announcement.", 400);

    await pool.query(`INSERT INTO announcements (announcement, ${team_id ? 'team_id' : 'project_id'}) VALUES ($1, $2);`, [announcement, team_id ?? project_id]);

    res.status(201).send({status: 'success'});
});

export const removeAnnouncement = catchAsync(async(req, res, next) => {
    const {announcement_id, team_id, project_id} = req.body;

    if(!announcement_id)
        throw new AppError("Please provide an announcement.", 400);

    if(!team_id && !project_id)
        throw new AppError("Please provide either team or project for this announcement.", 400);

    const result = await pool.query(`DELETE FROM announcements WHERE announcement_id = $1 AND ${team_id ? 'team_id' : 'project_id'} = $2 ;`, [announcement_id, team_id ?? project_id]);

    if(!result.rowCount)
        throw new AppError("Announcement not found.", 404);

    res.status(204).send({status: 'success'});
});

export const getAllAnnouncements = catchAsync(async(req, res, next) => {
    const {team_id, project_id} = req.body;

    if(!team_id && !project_id)
        throw new AppError("Please provide either team or project to get any announcement.", 400);

    const announcements = (await pool.query(`SELECT announcement_id, announcement, created_at FROM announcements WHERE ${team_id ? 'team_id' : 'project_id'} = $1;`, [team_id ?? project_id])).rows;

    res.status(200).send({
        status: 'success',
        data: {
            announcements
        }
    });
});