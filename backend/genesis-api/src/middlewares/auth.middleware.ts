import { URL } from 'node:url';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_COOKIE } from '../config/cookie';
import { env } from '../config/env';
import { isUserRole, type UserRole } from '../modules/users/domain/user.entity';
import { AppError } from '../shared/AppError';

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const [scheme, bearer] = req.header('authorization')?.split(' ') ?? [];
  const bearerToken = scheme === 'Bearer' && bearer ? bearer : undefined;
  const cookieValue: unknown = req.cookies?.[AUTH_COOKIE];
  const cookieToken = typeof cookieValue === 'string' && cookieValue ? cookieValue : undefined;
  const token = bearerToken ?? cookieToken;

  if (!token) return next(AppError.unauthorized('Acesso negado. Faça login para continuar.'));

  if (!bearerToken && UNSAFE_METHODS.has(req.method)) {
    if (req.header('sec-fetch-site') === 'cross-site') {
      return next(AppError.forbidden('Requisição cross-site bloqueada'));
    }

    let origin = req.header('origin');
    const referer = req.header('referer');
    if (!origin && referer) {
      try {
        origin = new URL(referer).origin;
      } catch {
        origin = undefined;
      }
    }

    if (!origin || !env.CORS_ORIGINS.includes(origin)) {
      return next(AppError.forbidden('Origem não permitida ou cabeçalho Origin ausente'));
    }
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
    if (typeof decoded === 'string' || typeof decoded.sub !== 'string' || !isUserRole(decoded.role)) {
      throw new Error('payload inválido');
    }
    req.auth = { userId: decoded.sub, role: decoded.role };
    next();
  } catch {
    next(AppError.unauthorized('Token inválido ou expirado'));
  }
};

export const requireRole =
  (...roles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) return next(AppError.forbidden());
    next();
  };
