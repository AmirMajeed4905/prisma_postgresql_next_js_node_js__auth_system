// src/middleware/auth.middleware.ts
import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AuthRequest } from "../types";
import { Role } from "@prisma/client";
import { AppError } from "./error.middleware";

// ========================
// AUTHENTICATE
// ========================
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authorization token nahi diya. Format: Bearer <token>",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token missing hai",
      });
      return;
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

// ========================
// AUTHORIZE (Role check)
// ========================
export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Pehle login karein", 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(
        new AppError(
          `Yeh action karne ka aap ko permission nahi. Zaroori role: ${roles.join(", ")}`,
          403
        )
      );
      return;
    }

    next();
  };
};
