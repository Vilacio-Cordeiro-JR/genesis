import type { ErrorRequestHandler, RequestHandler, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { isProduction } from '../config/env';
import { AppError } from '../shared/AppError';

const send = (res: Response, status: number, error: string, details?: unknown): void => {
  res.status(status).json({ success: false, error, ...(details === undefined ? {} : { details }) });
};

const isDuplicateKey = (err: unknown): err is { code: number; keyPattern?: Record<string, unknown> } =>
  typeof err === 'object' && err !== null && (err as { code?: unknown }).code === 11000;

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

  if (err instanceof mongoose.Error.ValidationError) return send(res, 400, 'Dados inválidos');
  if (err instanceof mongoose.Error.CastError) return send(res, 400, 'Identificador inválido');

  if (isDuplicateKey(err)) {
    const field = Object.keys(err.keyPattern ?? {})[0];
    return send(res, 409, field ? `Já existe um registro com este valor em "${field}"` : 'Registro duplicado');
  }

  if (err instanceof SyntaxError && 'body' in err) return send(res, 400, 'JSON inválido');

  if (!isProduction) console.error(err);
  else console.error(err instanceof Error ? err.message : err);
  send(res, 500, 'Erro interno do servidor');
};
