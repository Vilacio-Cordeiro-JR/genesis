import type { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { AppError } from '../shared/AppError';

const limiter = (windowMs: number, limit: number): RequestHandler =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, _res, next) => next(new AppError(429, 'Muitas requisições deste IP. Tente novamente mais tarde.')),
  });

export const generalLimiter = limiter(15 * 60 * 1000, 300);
export const quoteRateLimiter = limiter(15 * 60 * 1000, 5);
export const loginRateLimiter = limiter(15 * 60 * 1000, 10);
