// src/controllers/user.controller.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { userService } from "../services/user.service";
import { updateProfileSchema } from "../utils/validators";
import { z } from "zod";

export class UserController {
  // GET /api/users/profile
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getProfile(req.user!.userId);
      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /api/users/profile
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateProfileSchema.parse(req.body);
      const result = await userService.updateProfile(req.user!.userId, data);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/users/profile
  async deleteOwnAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await userService.deleteOwnAccount(req.user!.userId);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // ─── ADMIN ROUTES ───────────────

  // GET /api/users
  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit } = z
        .object({
          page: z.coerce.number().min(1).default(1),
          limit: z.coerce.number().min(1).max(100).default(10),
        })
        .parse(req.query);

      const result = await userService.getAllUsers(page, limit);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/:id
  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /api/users/:id/role
  async updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { role } = z
        .object({ role: z.enum(["USER", "ADMIN"]) })
        .parse(req.body);
      const result = await userService.updateUserRole(req.params.id, role);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/users/:id
  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await userService.deleteUser(
        req.params.id,
        req.user!.userId
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();