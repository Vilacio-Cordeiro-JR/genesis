import type { Request, Response } from 'express';
import { authCookieOptions, AUTH_COOKIE, clearCookieOptions } from '../../../config/cookie';
import { AppError } from '../../../shared/AppError';
import { sendOk } from '../../../shared/response';
import type { AuthService } from '../application/auth.service';
import { loginSchema } from './auth.schemas';

export class AuthController {
  constructor(private readonly service: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = loginSchema.parse(req.body);
    const { token, user } = await this.service.login(email, password);
    res.cookie(AUTH_COOKIE, token, authCookieOptions);
    sendOk(res, { user });
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie(AUTH_COOKIE, clearCookieOptions);
    sendOk(res, { loggedOut: true });
  };

  me = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) throw AppError.unauthorized();
    sendOk(res, { user: await this.service.profile(req.auth.userId) });
  };
}
