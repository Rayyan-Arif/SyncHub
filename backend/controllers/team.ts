import Express from "express";
import { AppError, catchAsync } from "../utils/error.js";
import pool from "../db.js";

export const getAllTeamsOfManager = catchAsync(async(req, res, next) => {
    const {organization_id} = req.params;

    const teams = (await pool.query("SELECT team_id, team_name, no_of_members FROM team WHERE manager_id = $1 AND organization_id = $2;", [req.user.user_id, organization_id])).rows; 

    res.status(200).send({
        status: 'success',
        data: {
            teams
        }
    });
});

export const getTeamDetails = catchAsync(async(req, res, next) => {
    const {organization_id, team_id} = req.params;

    if(!team_id)
        throw new AppError("Please provide a team.", 400);

    const isTeamValid = (await pool.query("SELECT team_name, no_of_members FROM team WHERE manager_id = $1 AND team_id = $2 AND organization_id = $3", [req.user.user_id, team_id, organization_id])).rows[0];

    if(!isTeamValid)
        throw new AppError("This team does not exist or not found.", 404);

    const teamDetails = (await pool.query(`
        SELECT
        (
            SELECT json_agg(p)
            FROM project p WHERE team_id = $1
        ) AS projects,
        (
            SELECT json_agg(
                json_build_object(
                    'user_name', user_name,
                    'user_email', user_email
                )
            )
            FROM users u JOIN
            (SELECT team_member_id FROM team_membership WHERE team_id = $1) t
            ON u.user_id = t.team_member_id
        ) AS team_members;`, [team_id]
    )).rows;

    res.status(200).send({
        status: 'success',
        data: {
            team_name: isTeamValid.team_name,
            no_of_members: isTeamValid.no_of_members,
            team_details: teamDetails
        }
    })
});

export const createTeam = catchAsync(async (req, res, next) => {
    const {organization_id, team_name, no_of_members} = req.body;

    if(!team_name || !no_of_members)
        throw new AppError("Please provide complete team details.", 400);

    await pool.query("INSERT INTO team (team_name, no_of_members, organization_id, manager_id) VALUES ($1, $2, $3, $4);", [team_name, no_of_members, organization_id, req.user.user_id]);

    res.status(201).send({status: 'success'});
});