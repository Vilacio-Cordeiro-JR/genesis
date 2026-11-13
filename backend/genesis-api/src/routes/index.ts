import { Router } from 'express';
import { adminRoutes } from './admin.routes';
import { publicRoutes } from './public.routes';

export const apiRoutes = Router();

apiRoutes.use('/public', publicRoutes);
apiRoutes.use('/admin', adminRoutes);
