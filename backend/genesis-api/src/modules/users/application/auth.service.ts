import jwt from 'jsonwebtoken';
import { AppError } from '../../../shared/AppError';
import type { PublicUser } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';
import { hashPassword, verifyPassword } from './password';

export const TOKEN_TTL = '8h';

export interface LoginResult {
  token: string;
  tokenType: 'Bearer';
  expiresIn: typeof TOKEN_TTL;
  user: PublicUser;
}

export class AuthService {
  private readonly fallbackHash: Promise<string>;

  constructor(
    private readonly users: UserRepository,
    private readonly jwtSecret: string,
  ) {
    this.fallbackHash = hashPassword('genesis-timing-equalizer');
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.users.findByEmail(email);
    const valid = await verifyPassword(password, user?.passwordHash ?? (await this.fallbackHash));

    if (!user || !valid) throw AppError.unauthorized('Credenciais inválidas');

    const token = jwt.sign({ role: user.role }, this.jwtSecret, {
      algorithm: 'HS256',
      subject: user.id,
      expiresIn: TOKEN_TTL,
    });

    return {
      token,
      tokenType: 'Bearer',
      expiresIn: TOKEN_TTL,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async profile(userId: string): Promise<PublicUser> {
    const user = await this.users.findById(userId);
    if (!user) throw AppError.unauthorized('Sessão inválida');
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
