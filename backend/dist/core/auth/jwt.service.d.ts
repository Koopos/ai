export interface TokenPayload {
    userId: string;
    username: string;
    role: string;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare function generateTokenPair(payload: TokenPayload): TokenPair;
export declare function verifyAccessToken(token: string): TokenPayload;
export declare function verifyRefreshToken(token: string): {
    userId: string;
};
