import { Request, Response, NextFunction } from 'express';
import type { TokenPayload } from '../auth/jwt.service';
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
