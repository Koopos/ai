import { Router } from 'express';
import { registerController, loginController, getCurrentUserController, refreshTokenController, logoutController, } from './auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = Router();
// Public routes
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshTokenController);
// Protected routes
router.get('/me', authMiddleware, getCurrentUserController);
router.post('/logout', authMiddleware, logoutController);
export default router;
