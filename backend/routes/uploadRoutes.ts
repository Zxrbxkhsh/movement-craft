import { Router } from 'express';
import { uploadPhoto } from '../controllers/uploadController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.post('/', requireAdmin, uploadPhoto);

export default router;

