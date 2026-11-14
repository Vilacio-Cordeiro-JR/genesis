import type { ErrorRequestHandler, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { isProduction } from '../config/env';
import { AppError } from '../shared/AppError';

const send = (res: Response, status: number, error: string, details?: unknown): void => {
  res.status(status).json({ success: false, error, ...(details === undefined ? {} : { details }) });
};

// Erros lançados pelo driver `pg` trazem o SQLSTATE do Postgres em `code`.
// https://www.postgresql.org/docs/current/errcodes-appendix.html
interface PgError extends Error {
  code: string;
  constraint?: string;
}

const isPgError = (err: unknown): err is PgError =>
  err instanceof Error && typeof (err as { code?: unknown }).code === 'string' && /^[0-9A-Z]{5}$/.test((err as PgError).code);

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(AppError.notFound('Rota não encontrada'));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) return send(res, err.statusCode, err.message, err.details);

  if (err instanceof ZodError) {
    return send(
      res,
      400,
      'Dados inválidos',
      err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    );
  }

  if (isPgError(err)) {
    if (err.code === '23505') {
      return send(res, 409, err.constraint ? `Já existe um registro com este valor ("${err.constraint}")` : 'Registro duplicado');
    }
    if (err.code === '22P02') return send(res, 400, 'Identificador inválido');
    if (err.code === '23503') return send(res, 400, 'Referência inválida');
    if (err.code === '23502' || err.code === '23514') return send(res, 400, 'Dados inválidos');
  }

  if (err instanceof SyntaxError && 'body' in err) return send(res, 400, 'JSON inválido');

  if (!isProduction) console.error(err);
  else console.error(err instanceof Error ? err.message : err);
  send(res, 500, 'Erro interno do servidor');
};
