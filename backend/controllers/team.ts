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
    )).rows[0];

    teamDetails.projects = teamDetails.projects ?? [];
    teamDetails.team_members = teamDetails.team_members ?? [];

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

export const removeTeam = catchAsync(async(req, res, next) => {
    const {organization_id, team_id} = req.body;

    if(!team_id)
        throw new AppError("Please provide a team to delete.", 400);

    await pool.query("DELETE FROM team WHERE team_id = $1 AND manager_id = $2 AND organization_id = $3;", [team_id, req.user.user_id, organization_id]);
    
    res.status(204).send({});
});

export const addMemberToTeam = catchAsync(async(req, res, next) => {
    const {organization_id, team_id, user_emails} = req.body;

    if(!team_id || (!user_emails || !Array.isArray(user_emails) || user_emails.length === 0))
        throw new AppError("Please provide both team and user emails.", 400);

    //checking if member exists in this organization
    const userIDs = (await pool.query("SELECT user_id FROM organization_membership WHERE organization_id = $1 AND user_role = 'MEMBER' AND user_id IN (SELECT user_id FROM users WHERE user_email = ANY($2));", [organization_id, user_emails])).rows.map(user => user.user_id);

    if(userIDs?.length !== user_emails?.length)
        throw new AppError("Some users are not a member of this organization.", 400);

    const result = await pool.query(`
        INSERT INTO team_membership 
        SELECT $1, unnest($2::int[])
        WHERE EXISTS (
            SELECT 1 FROM team WHERE organization_id = $3 AND team_id = $1 and manager_id = $4
        );
    `, [team_id, userIDs, organization_id, req.user.user_id]);

    if(!result.rowCount)
        throw new AppError("This team is not part of the organization.", 404);

    res.status(200).send({status: 'success'});
});

export const removeMemberFromTeam = catchAsync(async(req, res, next) => {
    const {organization_id, team_id, user_email} = req.body;

    if(!(+team_id) || !user_email)
        throw new AppError("Please provide both team and user email.", 400);

    //checking if member exists in this organization
    const userID = (await pool.query("SELECT user_id FROM organization_membership WHERE organization_id = $1 AND user_role = 'MEMBER' AND user_id IN (SELECT user_id FROM users WHERE user_email = $2);", [+organization_id, user_email])).rows[0].user_id;
    const isTeamExist = (await pool.query("SELECT 1 FROM team WHERE organization_id = $1 AND team_id = $2 and manager_id = $3;", [+organization_id, +team_id, req.user.user_id])).rows[0];

    if(!userID)
        throw new AppError("This user is not a member of this organization.", 400);

    if(!isTeamExist)
        throw new AppError("This team does not exist.", 400);

    await pool.query("DELETE FROM team_membership WHERE team_id = $1 AND team_member_id = $2;", [team_id, userID]);

    res.status(204).send({});
});