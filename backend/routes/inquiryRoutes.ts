import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus
} from '../controllers/inquiryController';
import { requireAdmin } from '../middleware/authMiddleware';
import { validateInquiryInput } from '../middleware/validateMiddleware';

const router = Router();

router.post('/', validateInquiryInput, createInquiry);
router.get('/', requireAdmin, getInquiries);
router.put('/:id/status', requireAdmin, updateInquiryStatus);

export default router;

