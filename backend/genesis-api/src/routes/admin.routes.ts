import { Router } from 'express';
import { authController, projectController, quoteController } from '../container';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { loginEmailLimiter, loginRateLimiter } from '../middlewares/rateLimiters';
import { asyncHandler } from '../shared/asyncHandler';

export const adminRoutes = Router();

adminRoutes.post('/auth/login', loginRateLimiter, loginEmailLimiter, asyncHandler(authController.login));

adminRoutes.post('/auth/logout', asyncHandler(authController.logout));

adminRoutes.use(authMiddleware);

adminRoutes.get('/auth/me', asyncHandler(authController.me));

// Toda rota abaixo exige explicitamente um papel de equipe (ADMIN ou SUPER_ADMIN),
// mesmo sendo hoje os únicos papéis existentes: se um papel novo e mais restrito
// (ex.: leitor) for adicionado no futuro, ele não herda acesso por omissão.
const staffOnly = requireRole('ADMIN', 'SUPER_ADMIN');

adminRoutes.get('/projects', staffOnly, asyncHandler(projectController.listAdmin));
adminRoutes.post('/projects', staffOnly, asyncHandler(projectController.create));
adminRoutes.put('/projects/:id', staffOnly, asyncHandler(projectController.update));
adminRoutes.delete('/projects/:id', staffOnly, asyncHandler(projectController.remove));

adminRoutes.get('/quotes', staffOnly, asyncHandler(quoteController.list));
adminRoutes.get('/quotes/metrics', staffOnly, asyncHandler(quoteController.metrics));
adminRoutes.patch('/quotes/:id/status', staffOnly, asyncHandler(quoteController.updateStatus));
