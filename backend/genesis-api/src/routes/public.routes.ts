import { Router } from 'express';
import { projectController, quoteController } from '../container';
import { publicApiKeyMiddleware } from '../middlewares/publicApiKey.middleware';
import { quoteRateLimiter } from '../middlewares/rateLimiters';
import { asyncHandler } from '../shared/asyncHandler';

export const publicRoutes = Router();

publicRoutes.use(publicApiKeyMiddleware);
publicRoutes.get('/projects', asyncHandler(projectController.listPublic));
publicRoutes.get('/projects/:slug', asyncHandler(projectController.getPublicBySlug));
publicRoutes.post('/quotes', quoteRateLimiter, asyncHandler(quoteController.create));
