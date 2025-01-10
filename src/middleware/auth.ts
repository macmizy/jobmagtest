import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseService } from './responseService';

const SECRET_KEY = 'secret-key'; 

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    ResponseService.errorResponse(res, 'Unauthorized: No token provided', 401);
    return 
    
  }

  jwt.verify(token as string, SECRET_KEY, (err: any) => {
    if (err) {
      ResponseService.errorResponse(res, 'Forbidden: Invalid token', 403);
      return
    }
    next();
  });
};
