import { Router } from 'express';
import { authController, projectController, quoteController } from '../container';
import { authMiddleware } from '../middlewares/auth.middleware';
import { loginRateLimiter } from '../middlewares/rateLimiters';
import { asyncHandler } from '../shared/asyncHandler';

export const adminRoutes = Router();

adminRoutes.post('/auth/login', loginRateLimiter, asyncHandler(authController.login));

adminRoutes.post('/auth/logout', asyncHandler(authController.logout));

adminRoutes.use(authMiddleware);

adminRoutes.get('/auth/me', asyncHandler(authController.me));

adminRoutes.get('/projects', asyncHandler(projectController.listAdmin));
adminRoutes.post('/projects', asyncHandler(projectController.create));
adminRoutes.put('/projects/:id', asyncHandler(projectController.update));
adminRoutes.delete('/projects/:id', asyncHandler(projectController.remove));

adminRoutes.get('/quotes', asyncHandler(quoteController.list));
adminRoutes.patch('/quotes/:id/status', asyncHandler(quoteController.updateStatus));
