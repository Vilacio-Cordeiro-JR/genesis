import { http } from '../lib/http';
import type { AdminUser, ApiSuccess, AuthResponse } from '../types/api';

export const authService = {
  async login(email: string, password: string): Promise<AdminUser> {
    const { data } = await http.post<ApiSuccess<AuthResponse>>('/admin/auth/login', { email, password });
    return data.data.user;
  },
  async me(): Promise<AdminUser> {
    const { data } = await http.get<ApiSuccess<AuthResponse>>('/admin/auth/me');
    return data.data.user;
  },
  async logout(): Promise<void> {
    await http.post('/admin/auth/logout');
  },
};
