export const USER_ROLES = ['ADMIN', 'SUPER_ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value);

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export type PublicUser = Pick<User, 'id' | 'name' | 'email' | 'role'>;
