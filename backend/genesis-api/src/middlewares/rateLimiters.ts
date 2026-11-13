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

// Limita por e-mail (além do limite por IP acima), para que um atacante
// não contorne o bloqueio de força bruta só trocando de IP/proxy.
export const loginEmailLimiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email;
    return typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : 'sem-email';
  },
  handler: (_req, _res, next) =>
    next(new AppError(429, 'Muitas tentativas de login para este e-mail. Tente novamente mais tarde.')),
});
