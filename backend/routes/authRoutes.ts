import { Router } from 'express';
import { login, checkAuth, logout, changePassword } from '../controllers/authController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.get('/check', checkAuth);
router.post('/logout', logout);
router.put('/change-password', requireAdmin, changePassword);

export default router;

