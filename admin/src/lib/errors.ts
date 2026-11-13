import axios from 'axios';

interface ApiErrorBody {
  error?: string;
  details?: { path?: string; message?: string }[];
}

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) return 'Não foi possível conectar à API.';
    const { error: message, details } = error.response.data ?? {};
    const first = details?.[0];
    if (first?.message) return `${message ?? 'Dados inválidos'}: ${first.path ? `${first.path} - ` : ''}${first.message}`;
    if (message) return message;
  }
  return 'Ocorreu um erro inesperado.';
};
