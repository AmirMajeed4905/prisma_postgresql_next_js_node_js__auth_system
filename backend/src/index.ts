// src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { generalLimiter } from "./middleware/rateLimit.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────
// SECURITY MIDDLEWARE
// ─────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    process.env.FRONTEND_URL || "",
  ].filter(Boolean),
  credentials: true,
}));
app.use(generalLimiter);

// ─────────────────────────────────
// BODY PARSERS
// ─────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────
// ROUTES
// ─────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "🔐 Auth System API chal rahi hai!",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
    },
    authEndpoints: {
      register: "POST /api/auth/register",
      verifyEmail: "GET /api/auth/verify-email/:token",
      resendVerification: "POST /api/auth/resend-verification",
      login: "POST /api/auth/login",
      refresh: "POST /api/auth/refresh",
      logout: "POST /api/auth/logout",
      logoutAll: "POST /api/auth/logout-all",
      me: "GET /api/auth/me",
      forgotPassword: "POST /api/auth/forgot-password",
      resetPassword: "POST /api/auth/reset-password",
      changePassword: "POST /api/auth/change-password",
    },
    userEndpoints: {
      getProfile: "GET /api/users/profile",
      updateProfile: "PATCH /api/users/profile",
      deleteOwnAccount: "DELETE /api/users/profile",
      adminGetAll: "GET /api/users (Admin)",
      adminGetOne: "GET /api/users/:id (Admin)",
      adminUpdateRole: "PATCH /api/users/:id/role (Admin)",
      adminDelete: "DELETE /api/users/:id (Admin)",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ─────────────────────────────────
// ERROR HANDLERS
// ─────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─────────────────────────────────
// SERVER START
// ─────────────────────────────────
app.listen(PORT, () => {
  console.log("");
  console.log("🚀 ================================");
  console.log(`✅  Server: http://localhost:${PORT}`);
  console.log(`🌍  Mode:   ${process.env.NODE_ENV || "development"}`);
  console.log(`📦  DB:     PostgreSQL (Prisma)`);
  console.log("🚀 ================================");
  console.log("");
});

export default app;
