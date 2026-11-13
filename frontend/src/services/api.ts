import axios, { isAxiosError } from 'axios';
import type { ApiErrorBody, ApiSuccess, Project, QuotePayload } from '../types';

declare module 'axios' {
  interface AxiosRequestConfig {
    silent?: boolean;
  }
}

const publicApiKey = import.meta.env.VITE_PUBLIC_API_KEY;

if (!publicApiKey && import.meta.env.DEV) {
  console.warn('VITE_PUBLIC_API_KEY não configurada: as chamadas à API pública serão recusadas.');
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': publicApiKey ?? '',
  },
});

let reportError: (message: string) => void = () => undefined;

export const setGlobalErrorCallback = (callback: (message: string) => void): void => {
  reportError = callback;
};

const describeError = (error: unknown): string => {
  if (!isAxiosError<ApiErrorBody>(error)) return 'Ocorreu um erro inesperado.';
  if (!error.response) return 'Servidor indisponível no momento. Verifique sua conexão.';

  const { status, data } = error.response;
  if (status === 429) return 'Muitas requisições. Por favor, aguarde um momento.';
  if (status === 401 || status === 403) return 'Acesso bloqueado por políticas de segurança.';
  if (status === 400 && data?.details?.[0]?.message) return `Verifique os dados enviados: ${data.details[0].message}`;
  return data?.error ?? 'Ocorreu um erro inesperado de comunicação com o servidor.';
};

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!isAxiosError(error) || !error.config?.silent) reportError(describeError(error));
    return Promise.reject(error);
  },
);

interface ProjectsResponse extends ApiSuccess<Project[]> {}

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const { data } = await api.get<ProjectsResponse>('/public/projects', { silent: true, params: { limit: 50 } });
    return data.data;
  },
  async getPresets(): Promise<Project[]> {
    const { data } = await api.get<ProjectsResponse>('/public/projects', { silent: true, params: { isPreset: true, limit: 50 } });
    return data.data;
  },
};

export const quoteService = {
  async submitQuote(payload: QuotePayload): Promise<void> {
    await api.post('/public/quotes', payload);
  },
};
