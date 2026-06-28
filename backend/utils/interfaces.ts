import "express";

declare global {
    namespace Express {
        interface Request {
            user: {
                user_id: number,
                user_name: string,
                user_email: string,
                user_role: string
            }
        }
    }
}

export interface TeamsData {
    "team_id": string,
    "team_name": string,
    "no_of_members": number,
    "project_id": number,
    "project_name": string,
    "description": string,
    "status": string,
    "start_date": string,
    "target_completion_date": string
}

export interface TokenPayLoad {
    email: string
}

export interface LoginBody {
    user_email: string,
    user_password: string
}

export interface SignupBody{
    user_name: string,
    user_email: string,
    user_password: string,
}