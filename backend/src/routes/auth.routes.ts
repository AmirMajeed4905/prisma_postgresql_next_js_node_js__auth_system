// src/routes/auth.routes.ts
import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import {
  authLimiter,
  passwordResetLimiter,
} from "../middleware/rateLimit.middleware";

const router = Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────
router.post("/register", authLimiter, authController.register.bind(authController));
router.get("/verify-email/:token", authController.verifyEmail.bind(authController));
router.post("/resend-verification", authLimiter, authController.resendVerification.bind(authController));
router.post("/login", authLimiter, authController.login.bind(authController));
router.post("/refresh", authController.refresh.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.post("/forgot-password", passwordResetLimiter, authController.forgotPassword.bind(authController));
router.post("/reset-password", authController.resetPassword.bind(authController));

// ─── PROTECTED ROUTES (login zaroori) ───────────────────
router.get("/me", authenticate, authController.me.bind(authController));
router.post("/logout-all", authenticate, authController.logoutAll.bind(authController));
router.post("/change-password", authenticate, authController.changePassword.bind(authController));

export default router;
