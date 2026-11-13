import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1',
  timeout: 15000,
  withCredentials: true,
});

let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

const AUTH_PATHS = ['/admin/auth/login', '/admin/auth/me', '/admin/auth/logout'];

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && !AUTH_PATHS.some((path) => error.config?.url?.endsWith(path))) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);
