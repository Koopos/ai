import { register, login, refreshAccessToken } from './auth.service';
export async function registerController(req, res) {
    try {
        const { username, email, password, displayName } = req.body;
        if (!username || !password || !displayName) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
            });
        }
        const result = await register({ username, email, password, displayName });
        res.status(201).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}
export async function loginController(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Missing username or password',
            });
        }
        const result = await login({ username, password });
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({
                success: false,
                error: error.message,
            });
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}
export async function getCurrentUserController(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
            });
        }
        // Note: You would typically fetch the full user from database here
        // For now, return the user info from token
        res.status(200).json({
            success: true,
            data: req.user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}
export async function refreshTokenController(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'Missing refresh token',
            });
        }
        const result = await refreshAccessToken(refreshToken);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({
                success: false,
                error: error.message,
            });
        }
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}
export async function logoutController(req, res) {
    // In a real app, you would invalidate the refresh token
    res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully' },
    });
}
