import type {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppError, catchAsync } from "../utils/error.js";
import pool from "../db.js";
import type { LoginBody, SignupBody, TokenPayLoad } from "../utils/interfaces.js";

// Request<
//     Params,
//     ResponseBody,
//     RequestBody,
//     Query
// >

const signToken = (email: string): string => {
    return jwt.sign({email}, process.env.JWT_SECRET!, {
        expiresIn: '40d'
    });
}

const createFreshUser = (email: string, status: number, res: Response): void => {
    const token: string = signToken(email); 

    res.cookie("synchub-user-token", token, {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 40 * 24 * 60 * 60 * 1000
    });

    res.status(status).send({
        status: 'success',
        token
    });
}

export const signup = catchAsync(async (req: Request<{}, {}, SignupBody>, res: Response, next: NextFunction): Promise<void> => {
    const {user_name, user_email, user_password} = req.body;

    if(!user_name || !user_email || !user_password)
        throw new AppError("Incomplete data for signup", 400);

    const hashed_password = await bcrypt.hash(user_password, 12);

    await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3);", [user_name, user_email, hashed_password]);

    createFreshUser(user_email, 201, res);
});

export const login = catchAsync(async(req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction): Promise<void> => {
    const {user_email, user_password} = req.body;

    if(!user_email || !user_password)
        throw new AppError("Please provide email and password", 400);

    const user = (await pool.query("SELECT user_email, user_password FROM users WHERE user_email = $1;", [user_email])).rows[0];
    
    const isPasswordCorrect = await bcrypt.compare(user_password, user?.user_password ?? "");

    if(!user || !isPasswordCorrect)
        throw new AppError("Incorrect email or password.", 401);

    createFreshUser(user_email, 200, res);
});

export const protect = catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token: string = req.cookies["synchub-user-token"];

    if(!token)
        throw new AppError("You are not logged in.", 401);

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayLoad;
    
    const user = (await pool.query("SELECT user_id, user_email, user_name, user_role FROM users WHERE user_email = $1;", [payload.email])).rows[0];

    if(!user)
        throw new AppError("User not found!", 404);

    req.user = user;

    next();
});

export const logout = catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.clearCookie("synchub-user-token", {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 40 * 24 * 60 * 60 * 1000
    });

    res.status(200).send({
        status: 'success'
    });
});

export const isAccessAllowed = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!roles.some(role => role === req.user.user_role))
            throw new AppError("You are now allowed to perform this operation", 401);
        next();
    }
}

export const isOrganizationPermission = (roles: string[]) => {
    return catchAsync(async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        const organization_id: number = req.body.organization_id ?? req.params.organization_id;

        if(!organization_id)
            throw new AppError("Please provide an organization", 400);

        let user = null;
        if(roles.includes('ADMIN')){
            user = await pool.query("SELECT 1 FROM organization WHERE organization_id = $1 AND admin_id = $2;", [req.params.organization_id, req.user.user_id]);
        }
        
        if(!user?.rowCount)
            user = await pool.query("SELECT 1 FROM organization_membership WHERE organization_id = $1 AND user_id = $2 and user_role = ANY($3);", [organization_id, req.user.user_id, roles]);
        
        if(!user?.rowCount)
            throw new AppError("Only allowed members of the organization can perform this operation.", 401);

        next();
    });
}

export const isTeamOfOrganization = catchAsync(async(req, res, next) => {
    const {organization_id, team_id} = req.body;
    
    const isTeamValid = (await pool.query("SELECT 1 FROM team WHERE team_id = $1 AND organization_id = $2 AND manager_id = $3", [team_id, organization_id, req.user.user_id])).rowCount;

    if(!isTeamValid)
        throw new AppError("Team not found.", 404);

    next();
});

export const isProjectAccessAllowed = catchAsync(async(req, res, next) => {
    const {project_id, team_id} = req.body;

    if(!(+project_id) || !(+team_id))
        throw new AppError("No such project or team exists.", 400);
    
    const isProjectAccess = (await pool.query("SELECT 1 FROM project p WHERE project_id = $1 AND p.team_id = $2 AND EXISTS(SELECT 1 FROM team WHERE team_id = p.team_id AND manager_id = $3);", [project_id, team_id, req.user.user_id])).rowCount;

    if(!isProjectAccess)
        throw new AppError("Project not found.", 404);

    next();
});