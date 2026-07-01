import pool from "../db.js";
import type { Request, Response, NextFunction } from "express";
import { AppError, catchAsync } from "../utils/error.js";
import { formatOrganizationDetails } from "../utils/helper.js";

export const createOrganization = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {organization_name, contact, description} = req.body;

    if(!organization_name || !contact)
        throw new AppError("Please provide complete details of an organization.", 400);
    
    await pool.query("CALL create_organization($1, $2, $3, $4);", [organization_name, contact, description, req.user.user_id]);

    res.status(201).send({
        status: 'success'
    });
});

export const addUserToOrganization = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {user_email, user_role} = req.body;        
    const organization_id: number = +req.params.organization_id!;

    if(!user_email || !organization_id || !user_role)
        throw new AppError("Please provide complete details like email, organization and role of user.", 400);

    const user = (await pool.query("SELECT user_id FROM users WHERE user_email = $1;", [user_email])).rows[0];

    if(!user)
        throw new AppError("User does not exist. Invalid email.", 404);

    await pool.query("INSERT INTO organization_membership VALUES ($1, $2, $3);", [user.user_id, organization_id, user_role]);

    res.status(201).send({status: 'success'});
});

export const removeUserFromOrganization = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {user_email, user_role} = req.body;
    const organization_id: number = +req.params.organization_id!;

    if(!user_email || !organization_id || !user_role)
        throw new AppError("Please provide complete details like email, organization and role of user.", 400);

    const user = (await pool.query("SELECT user_id FROM users WHERE user_email = $1;", [user_email])).rows[0];

    if(!user)
        throw new AppError("User does not exist. Invalid email.", 404);

    await pool.query("DELETE FROM organization_membership WHERE user_id = $1 AND organization_id = $2 AND user_role = $3;", [user.user_id, organization_id, user_role]);

    res.status(204).send({});
});

export const deleteOrganization = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const organization_id: number = +req.params.organization_id!;

    if(!organization_id)
        throw new AppError("Please provide an organization to delete.", 400);

    await pool.query("DELETE FROM organization WHERE organization_id = $1", [+organization_id]);

    res.status(204).send({});
});

export const getOrganizationDetailsForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const organization_id: number = +req.params.organization_id!;

    if(!organization_id)
        throw new AppError("Please provide an organization to get details.", 400);

    //get organization data
    const organizationDetails = (await pool.query("SELECT organization_id, organization_name, contact, description, created_at FROM organization WHERE organization_id = $1;", [organization_id])).rows[0];

    //get members data
    const members = (await pool.query(
        `SELECT u.user_id, om.user_role, u.user_name, u.user_email, u.created_at FROM organization o 
        JOIN organization_membership om on o.organization_id = om.organization_id 
        JOIN users u on u.user_id = om.user_id AND om.user_role != 'ADMIN'
        WHERE o.organization_id = $1`, [organization_id]
    )).rows;

    //get teams and projects info
    const teamsAndProjects = (await pool.query(
        `SELECT t.team_id, t.team_name, t.no_of_members, p.project_id, p.project_name, p.description, p.status, p.start_date, p.target_completion_date FROM organization o
        JOIN team t ON t.organization_id = o.organization_id
        JOIN project p ON p.team_id = t.team_id
        WHERE o.organization_id = $1;`, [organization_id]
    )).rows;

    const organization = formatOrganizationDetails(organizationDetails, members, teamsAndProjects);

    res.status(200).send({
        status: 'success',
        data: {
            organization
        }
    });
});

export const generateReportForAdmin = (roles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const organization_id: number = +req.params.organization_id!;

        if(!organization_id)
            throw new AppError("Please provide an organization to get details.", 400);
        
        let performance = {};

        if(roles.includes('MEMBER')){
            const members = (await pool.query(`
                SELECT u.user_id, u.user_name, u.user_email, COUNT(DISTINCT(tm.team_id)) AS teams_joined, COUNT(DISTINCT(pe.project_id)) AS projects_joined, COUNT(DISTINCT(ast2.task_id)) AS tasks_assigned, COUNT(DISTINCT(ast1.task_id)) AS tasks_completed FROM 
                (SELECT * FROM organization_membership WHERE organization_id = $1 and user_role = 'MEMBER') om
                JOIN (SELECT user_id, user_name, user_email FROM users) u ON u.user_id = om.user_id
                JOIN (SELECT team_id, organization_id FROM team WHERE organization_id = $1) t ON t.organization_id = om.organization_id
                LEFT JOIN team_membership tm ON t.team_id = tm.team_id AND u.user_id = tm.team_member_id
                JOIN (SELECT project_id, team_id FROM project) p ON p.team_id = t.team_id
                LEFT JOIN project_enrollment pe ON pe.project_id = p.project_id AND u.user_id = pe.member_id
                JOIN (SELECT task_id, project_id FROM task) tk ON tk.project_id = p.project_id
                LEFT JOIN (SELECT task_id, member_id FROM assigned_tasks WHERE status = 'COMPLETED') ast1 ON tk.task_id = ast1.task_id AND u.user_id = ast1.member_id
                LEFT JOIN (SELECT task_id, member_id FROM assigned_tasks) ast2 ON tk.task_id = ast2.task_id AND u.user_id = ast2.member_id
                GROUP BY u.user_id, u.user_name, u.user_email;`, [organization_id]
            )).rows

            performance = {...performance, members};
        }

        if(roles.includes("MANAGER")){
            const managers = (await pool.query(`
                SELECT u.user_id, u.user_name, u.user_email, COUNT(DISTINCT(t.team_id)) AS teams_created, COUNT(DISTINCT(p1.project_id)) AS projects_created,COUNT(DISTINCT(p2.project_id)) AS projects_completed FROM 
                (SELECT organization_id, user_id FROM organization_membership WHERE organization_id = $1 AND user_role = 'MANAGER') om
                JOIN (SELECT user_id, user_name, user_email FROM users) u ON u.user_id = om.user_id
                LEFT JOIN (SELECT team_id, manager_id FROM team WHERE organization_id = $1) t ON t.manager_id = u.user_id 
                LEFT JOIN (SELECT project_id, team_id FROM project) p1 ON p1.team_id = t.team_id
                LEFT JOIN (SELECT project_id, team_id FROM project WHERE status = 'COMPLETED') p2 ON p1.project_id = p2.project_id
                GROUP BY u.user_id, u.user_name, u.user_email;`, [organization_id]
            )).rows;

            performance = {...performance, managers};
        }

        res.status(200).send({
            status: 'success',
            data: {
                performance
            }
        });
    });
}

export const getAllOrganizations = catchAsync(async(req, res, next) => {
    const organizations = (await pool.query(`
        SELECT 
        (
            SELECT json_agg(o)
            FROM organization o WHERE admin_id = $1
        ) AS admin_of_organizations,
        (
            SELECT json_agg(
                json_build_object(
                    'organization_id', o.organization_id,
                    'organization_name', o.organization_name,
                    'contact', contact,
                    'description', description,
                    'created_at', created_at,
                    'role_in_organization', om.user_role
                )
            )
            FROM (SELECT * FROM organization_membership WHERE user_id = $1) om 
            JOIN organization o ON o.organization_id = om.organization_id
        ) AS member_of_organizations;
    `, [req.user.user_id])).rows[0];

    organizations.admin_of_organizations = organizations.admin_of_organizations ?? [];
    organizations.member_of_organizations = organizations.member_of_organizations ?? [];

    res.status(200).send({
        status: 'success',
        data: {
            organizations
        }
    });
});

export const getOrganizationTeamsForMember = catchAsync(async(req, res, next) => {
    const {organization_id} = req.body;

    const teams = (await pool.query(`
        SELECT 
        (
            SELECT json_agg(t)
            FROM team t WHERE manager_id = $1 AND organization_id = $2
        ) AS teams_created,
        (
            SELECT json_agg(
                json_build_object(
                    'team_id', t.team_id,
                    'team_name', t.team_name,
                    'no_of_members', t.no_of_members
                )
            )
            FROM team t WHERE organization_id = $2 AND EXISTS
            (SELECT 1 FROM team_membership WHERE team_id = t.team_id AND team_member_id = $1)
        ) AS teams_joined;    
    `, [req.user.user_id, organization_id])).rows[0];

    teams.teams_created = teams.teams_created ?? [];
    teams.teams_joined = teams.teams_joined ?? [];

    res.status(200).send({
        status: 'success',
        data: {
            teams
        }
    });
});