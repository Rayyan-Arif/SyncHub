import Express from "express";
import { AppError, catchAsync } from "../utils/error.js";
import type { ProjectData } from "../utils/interfaces.js";
import pool from "../db.js";

export const createProject = catchAsync(async(req, res, next) => {
    const {project_name, description, start_date, target_completion_date, team_id} = req.body as ProjectData;

    if(!project_name || !start_date || !target_completion_date || !(+team_id))
        throw new AppError("Please provide complete details for the project.", 400);

    await pool.query("INSERT INTO project (project_name, description, start_date, target_completion_date, team_id) VALUES ($1, $2, $3, $4, $5);", [project_name, description, start_date, target_completion_date, team_id]);

    res.status(201).send({status: 'success'});
});

export const removeProject = catchAsync(async(req, res, next) => {
    const {project_id, team_id} = req.body;

    if(!project_id)
        throw new AppError("Please provide a project to delete.", 400);

    await pool.query("DELETE FROM project WHERE project_id = $1 AND team_id = $2;", [project_id, team_id]);

    res.status(204).send({});
});

export const addMemberToProject = catchAsync(async(req, res, next) => {
    const {project_id, team_id, member_emails} = req.body;

    if(!(+project_id) || !(+team_id) || (!member_emails || !Array.isArray(member_emails) || member_emails.length === 0))
        throw new AppError("Please provide a project and atleast 1 member to add them to project.", 400);
 
    const memberIDs = (await pool.query("SELECT team_member_id FROM team_membership tm WHERE team_member_id IN (SELECT user_id FROM users u WHERE user_email = ANY($1));", [member_emails])).rows.map(member => member.team_member_id);

    if(memberIDs?.length !== member_emails?.length)
        throw new AppError("Some users are not part of this team.", 400);

    //SELECT is related to WHERE EXISTS, if EXISTS is true then SELECT selects all rows otherwise no rows
    const result = await pool.query(`
        INSERT INTO project_enrollment 
        SELECT $1, unnest($2::INT[])
        WHERE EXISTS (
            SELECT 1 FROM project WHERE team_id = $3 AND project_id = $1
        );
    `, [project_id, memberIDs, team_id]);

    //INSERT query returns how many rows inserted
    if(!result.rowCount)
        throw new AppError("This project is not part of the team.", 404);

    res.status(201).send({status: 'success'});
}); 

export const removeMemberFromProject = catchAsync(async(req, res, next) => {
    const {project_id, team_id, member_email} = req.body;

    if(!(+project_id) || !(+team_id) || !member_email)
        throw new AppError("Please provide a project and member.", 400);
 
    const memberID = (await pool.query("SELECT team_member_id FROM team_membership tm WHERE team_member_id = (SELECT user_id FROM users u WHERE user_email = $1);", [member_email])).rows[0]?.team_member_id;

    if(!memberID)
        throw new AppError("This member is not part of the team", 404);

    const result = await pool.query(`
        DELETE FROM project_enrollment
        WHERE project_id = $1 AND member_id = $2 AND 
        EXISTS (
            SELECT 1 FROM project WHERE project_id = $1 AND team_id = $3
        );
    `, [project_id, memberID, team_id]);

    //DELETE query returns how many rows inserted
    if(!result.rowCount)
        throw new AppError("The membership of user in this project is not found or this project is not part of the team.", 404);

    res.status(204).send({status: 'success'});
});

export const getProjectDetails = catchAsync(async(req, res, next) => {
    const {team_id} = req.body;
    const {project_id} = req.params;

    if(!(+project_id!))
        throw new AppError("Please provide a project to get its details.", 400);

    const project = (await pool.query(`
        SELECT
        (
            SELECT json_agg(p)
            FROM project p WHERE team_id = $1 AND project_id = $2
        ) AS project_details,
        (
            SELECT json_agg(
                json_build_object(
                    'user_id', u.user_id,
                    'user_name', user_name,
                    'user_email', user_email
                )
            )
            FROM users u JOIN
            (SELECT * FROM project_enrollment WHERE project_id = $2) pe ON
            u.user_id = pe.member_id
        ) AS project_members,
        (
            SELECT json_agg(
                json_build_object(
                    'task_id', t.task_id,
                    'title', title,
                    'description', description,
                    'member_id', ast.member_id
                )
            )
            FROM (SELECT * FROM task WHERE project_id = $2) t
	        JOIN assigned_tasks ast ON ast.task_id = t.task_id
        ) AS assigned_tasks;
    `, [team_id, project_id])).rows[0];

    if(!project?.project_details)
        throw new AppError("Project not found.", 404);

    project.project_members = project.project_members ?? [];
    project.assigned_tasks = project.assigned_tasks ?? [];

    res.status(200).send({
        status: 'success',
        data: {
            project
        }
    });
});

export const getAllProjects = catchAsync(async(req, res, next) => {
    const {organization_id, team_id} = req.body;

    if(!(+organization_id) || !(+team_id))
        throw new AppError("Please provide complete details to get all projects.", 400);

    const projects = (await pool.query(`
        SELECT
        (
            SELECT json_agg(p)
            FROM project p WHERE team_id = $1 AND EXISTS 
            (
                SELECT 1 FROM team WHERE team_id = $1 AND manager_id = $3 AND organization_id = $2
            )
        ) AS projects_created,
        (
            SELECT json_agg(p)
            FROM
            (SELECT * FROM project WHERE team_id = (SELECT team_id FROM team WHERE team_id = $1 AND organization_id = $2)) p 
            JOIN (SELECT * FROM project_enrollment WHERE member_id = $3) pe ON pe.project_id = p.project_id
        ) AS projects_joined;    
    `, [team_id, organization_id, req.user.user_id])).rows[0];

    projects.projects_created = projects.projects_created ?? [];
    projects.projects_joined = projects.projects_joined ?? [];

    res.status(200).send({
        status: 'success',
        data: {
            projects
        }
    });
});