import type { User } from '@prisma/client';
export interface RegisterData {
    username: string;
    email?: string;
    password: string;
    displayName: string;
}
export interface LoginData {
    username: string;
    password: string;
}
export interface AuthResponse {
    user: Omit<User, 'passwordHash'>;
    accessToken: string;
    refreshToken: string;
}
export declare function register(data: RegisterData): Promise<AuthResponse>;
export declare function login(data: LoginData): Promise<AuthResponse>;
export declare function refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    user: any;
}>;
