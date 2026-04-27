export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFound(message) {
  return new AppError(message, 404);
}

export function badRequest(message) {
  return new AppError(message, 400);
}