import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number){
        super(message);

        this.statusCode = statusCode;
    }
}

export const catchAsync = (func: (a: Request, b: Response, c: NextFunction) => Promise<void>): (a: Request, b: Response, c: NextFunction) => Promise<void> => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            await func(req, res, next);
            
        //anything that is thrown comes in err. e.g if we throw 123, err becomes 123
        } catch(err: unknown){
            next(err);
        }
    }
}