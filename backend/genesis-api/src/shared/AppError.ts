export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(400, message, details);
  }

  static unauthorized(message = 'Não autenticado'): AppError {
    return new AppError(401, message);
  }

  static forbidden(message = 'Acesso negado'): AppError {
    return new AppError(403, message);
  }

  static notFound(message = 'Recurso não encontrado'): AppError {
    return new AppError(404, message);
  }

  static conflict(message: string): AppError {
    return new AppError(409, message);
  }
}
