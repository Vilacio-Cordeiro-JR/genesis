import { pool } from '../../../config/database';
import type { NewUser, User, UserRole } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

const toUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  passwordHash: row.password_hash,
  role: row.role,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class PgUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] ? toUser(rows[0]) : null;
  }

  async findById(id: string): Promise<User | null> {
    const { rows } = await pool.query<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] ? toUser(rows[0]) : null;
  }

  async create(data: NewUser): Promise<User> {
    const { rows } = await pool.query<UserRow>(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.name, data.email, data.passwordHash, data.role],
    );
    return toUser(rows[0]!);
  }
}
