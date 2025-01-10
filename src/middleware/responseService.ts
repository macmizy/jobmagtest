import { Response } from 'express';

export class ResponseService {
    public static successResponse(res: Response, data: any, message: string, code: number) {
        return res.status(code).json({
            success: true,
            message,
            data,
        });
    }

    public static errorResponse(res: Response, message: string, code: number) {
        return res.status(code).json({
            success : false,  
            message,
            data: null,
        });
    }
}