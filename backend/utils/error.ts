import type { Request, Response, NextFunction } from "express";
import Express from "express";

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number){
        super(message);

        this.statusCode = statusCode;
    }
}

const sendErrorProd = (err: unknown, res: Response) => {
    if(err instanceof AppError)
        res.status(err.statusCode).send({
            status: 'fail',
            message: err.message
        });
    
    res.status(500).send({
        status: 'fail',
        message: 'Internal Server Error. Try again later.'
    });
}

const sendErrorDev = (err: unknown, res: Response) => {
    console.error(err);

    if(err instanceof AppError)
        return res.status(err.statusCode).send({
            status: 'error',
            message: err.message,
            stack: err.stack
        });
    
    res.status(500).send({
        status: 'fail',
        message: 'Internal Server Error. Try again later.'
    });
}

export const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if(process.env.NODE_ENV === 'development')
        sendErrorDev(err, res);
    else if(process.env.NODE_ENV === 'production')
        sendErrorProd(err, res);
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