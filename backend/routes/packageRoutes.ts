import { Router } from 'express';
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} from '../controllers/packageController';
import { requireAdmin, optionalAdminAuth } from '../middleware/authMiddleware';
import { validatePackageInput } from '../middleware/validateMiddleware';

const router = Router();

router.get('/', optionalAdminAuth, getPackages);
router.get('/:id', optionalAdminAuth, getPackageById);
router.post('/', requireAdmin, validatePackageInput, createPackage);
router.put('/:id', requireAdmin, validatePackageInput, updatePackage);
router.delete('/:id', requireAdmin, deletePackage);

export default router;

