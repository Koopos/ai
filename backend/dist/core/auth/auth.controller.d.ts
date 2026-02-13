import { Request, Response } from 'express';
export declare function registerController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function loginController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getCurrentUserController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function refreshTokenController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function logoutController(req: Request, res: Response): Promise<void>;
