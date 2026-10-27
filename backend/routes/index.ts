import { Router } from 'express';
import authRoutes from './authRoutes';
import packageRoutes from './packageRoutes';
import configRoutes from './configRoutes';
import addonRoutes from './addonRoutes';
import serviceRoutes from './serviceRoutes';
import uploadRoutes from './uploadRoutes';
import inquiryRoutes from './inquiryRoutes';
import { getStatus } from '../controllers/statusController';

const apiRouter = Router();

// Health and Status endpoints
apiRouter.get('/health', getStatus);
apiRouter.get('/status', getStatus);

// Domain Routes
apiRouter.use('/admin', authRoutes);
apiRouter.use('/packages', packageRoutes);
apiRouter.use('/config', configRoutes);
apiRouter.use('/addons', addonRoutes);
apiRouter.use('/services', serviceRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/inquiries', inquiryRoutes);

export default apiRouter;

