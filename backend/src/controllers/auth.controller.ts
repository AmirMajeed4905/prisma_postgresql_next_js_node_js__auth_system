// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AuthRequest } from "..";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from "../utils/validators";
import { z } from "zod";

export class AuthController {
  // POST /api/auth/register
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/auth/verify-email/:token
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const result = await authService.verifyEmail(token);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/auth/resend-verification
  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      const result = await authService.resendVerificationEmail(email);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/auth/login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/auth/refresh
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);
      const tokens = await authService.refreshTokens(refreshToken);
      res.json({ success: true, tokens });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/auth/logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);
      const result = await authService.logout(refreshToken);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/auth/logout-all
  async logoutAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.logoutAllDevices(req.user!.userId);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/auth/forgot-password
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = forgotPasswordSchema.parse(req.body);
      const result = await authService.forgotPassword(data);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/auth/reset-password
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = resetPasswordSchema.parse(req.body);
      const result = await authService.resetPassword(data);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/auth/change-password
  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = changePasswordSchema.parse(req.body);
      const result = await authService.changePassword(req.user!.userId, data);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/auth/me
  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, user: req.user });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
