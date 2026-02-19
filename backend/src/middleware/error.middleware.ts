// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Zod validation error
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation error - diye gaye data mein masla hai",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // JWT expired
  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      success: false,
      message: "Token expire ho gaya, refresh karein",
    });
    return;
  }

  // JWT invalid
  if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      message: "Token invalid hai",
    });
    return;
  }

  // Custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Generic server error
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Server mein masla aa gaya, baad mein koshish karein",
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} nahi mili`,
  });
};
