import { Router } from 'express';
import {
  getAddons,
  createAddon,
  updateAddon,
  deleteAddon
} from '../controllers/addonController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAddons);
router.post('/', requireAdmin, createAddon);
router.put('/:id', requireAdmin, updateAddon);
router.delete('/:id', requireAdmin, deleteAddon);

export default router;

