import { createHash, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';
import { env } from '../config/env';
import { AppError } from '../shared/AppError';

const digest = (value: string): Buffer => createHash('sha256').update(value).digest();
const expected = digest(env.PUBLIC_API_KEY);

export const publicApiKeyMiddleware: RequestHandler = (req, _res, next) => {
  const provided = req.header('x-api-key');
  if (!provided || !timingSafeEqual(digest(provided), expected)) {
    return next(AppError.unauthorized('Chave de API inválida'));
  }
  next();
};
