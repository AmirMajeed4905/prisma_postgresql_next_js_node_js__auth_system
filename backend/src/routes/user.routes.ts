// src/routes/user.routes.ts
import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

// Sab routes ke liye authenticate zaroori hai
router.use(authenticate);

// ─── USER ROUTES ────────────────────────────────────────
router.get("/profile", userController.getProfile.bind(userController));
router.patch("/profile", userController.updateProfile.bind(userController));
router.delete("/profile", userController.deleteOwnAccount.bind(userController));

// ─── ADMIN ROUTES ────────────────────────────────────────
router.get("/", authorize("ADMIN"), userController.getAllUsers.bind(userController));
router.get("/:id", authorize("ADMIN"), userController.getUserById.bind(userController));
router.patch("/:id/role", authorize("ADMIN"), userController.updateUserRole.bind(userController));
router.delete("/:id", authorize("ADMIN"), userController.deleteUser.bind(userController));

export default router;
