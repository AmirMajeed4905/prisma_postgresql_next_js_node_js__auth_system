// src/services/auth.service.ts
import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error.middleware";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from "../emails/emailService";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from "../utils/jwt";
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "../utils/validators";
import { TokenPair } from "../types";

export class AuthService {
  // ─────────────────────────────────
  // REGISTER
  // ─────────────────────────────────
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Yeh email pehle se registered hai", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        emailVerifyToken,
        emailVerifyExpiry,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    await sendVerificationEmail(data.email, data.name, emailVerifyToken);

    return {
      message: "Account ban gaya! Email check karein aur verify karein.",
      user,
    };
  }

  // ─────────────────────────────────
  // VERIFY EMAIL
  // ─────────────────────────────────
  async verifyEmail(token: string) {
    const user = await prisma.user.findUnique({
      where: { emailVerifyToken: token },
    });

    if (!user) throw new AppError("Verification token invalid hai", 400);
    if (user.isEmailVerified) throw new AppError("Email pehle se verified hai", 400);
    if (user.emailVerifyExpiry && user.emailVerifyExpiry < new Date()) {
      throw new AppError("Token expire ho gaya. Dobara register karein.", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpiry: null,
      },
    });

    return { message: "Email verify ho gaya! Ab login kar saktay hain." };
  }

  // ─────────────────────────────────
  // LOGIN
  // ─────────────────────────────────
  async login(data: LoginInput): Promise<{ tokens: TokenPair; user: object }> {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AppError("Email ya password galat hai", 401);
    }

    if (!user.isEmailVerified) {
      throw new AppError(
        "Pehle apni email verify karein. Inbox check karein.",
        403
      );
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return {
      tokens: { accessToken, refreshToken },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  // ─────────────────────────────────
  // REFRESH TOKENS
  // ─────────────────────────────────
  async refreshTokens(token: string): Promise<TokenPair> {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new AppError("Refresh token invalid ya expire ho gaya", 401);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken) throw new AppError("Refresh token invalid hai", 401);

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new AppError("Session expire ho gaya. Dobara login karein.", 401);
    }

    // Token rotation - purana delete, naya banao
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new AppError("User nahi mila", 404);

    const newPayload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ─────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────
  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return { message: "Logout ho gaye. Khuda hafiz!" };
  }

  // ─────────────────────────────────
  // LOGOUT ALL DEVICES
  // ─────────────────────────────────
  async logoutAllDevices(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
    return { message: "Sab devices se logout ho gaye." };
  }

  // ─────────────────────────────────
  // FORGOT PASSWORD
  // ─────────────────────────────────
  async forgotPassword(data: ForgotPasswordInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    // Security: same message dein chahe user mile ya na mile
    if (!user) {
      return {
        message:
          "Agar yeh email registered hai toh reset link bhej diya gaya hai.",
      };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 ghanta

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
    });

    await sendPasswordResetEmail(data.email, user.name, resetToken);

    return {
      message:
        "Agar yeh email registered hai toh reset link bhej diya gaya hai.",
    };
  }

  // ─────────────────────────────────
  // RESET PASSWORD
  // ─────────────────────────────────
  async resetPassword(data: ResetPasswordInput) {
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: data.token },
    });

    if (!user) throw new AppError("Password reset token invalid hai", 400);

    if (user.passwordResetExpiry && user.passwordResetExpiry < new Date()) {
      throw new AppError(
        "Reset token expire ho gaya. Dobara forgot password karein.",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    // Security: sab active sessions logout
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    await sendPasswordChangedEmail(user.email, user.name);

    return {
      message:
        "Password reset ho gaya! Naye password se login karein.",
    };
  }

  // ─────────────────────────────────
  // CHANGE PASSWORD (logged in)
  // ─────────────────────────────────
  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User nahi mila", 404);

    const isCurrentValid = await bcrypt.compare(
      data.currentPassword,
      user.password
    );
    if (!isCurrentValid) {
      throw new AppError("Current password galat hai", 400);
    }

    const hashedNew = await bcrypt.hash(data.newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNew },
    });

    // Sab other sessions logout
    await prisma.refreshToken.deleteMany({ where: { userId } });
    await sendPasswordChangedEmail(user.email, user.name);

    return { message: "Password change ho gaya. Dobara login karein." };
  }

  // ─────────────────────────────────
  // RESEND VERIFICATION EMAIL
  // ─────────────────────────────────
  async resendVerificationEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new AppError("Yeh email registered nahi hai", 404);
    if (user.isEmailVerified) throw new AppError("Email pehle se verified hai", 400);

    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken, emailVerifyExpiry },
    });

    await sendVerificationEmail(email, user.name, emailVerifyToken);

    return { message: "Verification email dobara bhej diya gaya hai." };
  }
}

export const authService = new AuthService();
