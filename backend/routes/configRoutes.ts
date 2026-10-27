import { Router } from 'express';
import { getConfig, updateConfig } from '../controllers/configController';
import { requireAdmin } from '../middleware/authMiddleware';
import { validateConfigInput } from '../middleware/validateMiddleware';

const router = Router();

router.get('/', getConfig);
router.put('/', requireAdmin, validateConfigInput, updateConfig);

export default router;

