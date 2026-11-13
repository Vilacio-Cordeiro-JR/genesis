import type { CookieOptions } from 'express';
import { env, isProduction } from './env';

export const AUTH_COOKIE = 'jwt';
export const AUTH_COOKIE_MAX_AGE_MS = 8 * 60 * 60 * 1000;

const sameSite = env.COOKIE_SAME_SITE ?? (isProduction ? 'none' : 'lax');

const baseOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction || sameSite === 'none',
  sameSite,
  path: '/',
};

export const authCookieOptions: CookieOptions = { ...baseOptions, maxAge: AUTH_COOKIE_MAX_AGE_MS };
export const clearCookieOptions: CookieOptions = baseOptions;
