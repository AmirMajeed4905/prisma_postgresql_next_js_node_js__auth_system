// src/utils/validators.ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Naam kam az kam 2 characters ka hona chahiye")
    .max(50, "Naam 50 characters se zyada nahi ho sakta"),
  email: z.string().email("Valid email address daalein"),
  password: z
    .string()
    .min(8, "Password kam az kam 8 characters ka hona chahiye")
    .regex(/[A-Z]/, "Password mein ek capital letter (A-Z) hona chahiye")
    .regex(/[0-9]/, "Password mein ek number (0-9) hona chahiye")
    .regex(/[^A-Za-z0-9]/, "Password mein ek special character hona chahiye"),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email daalein"),
  password: z.string().min(1, "Password daalein"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email daalein"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token zaroori hai"),
  password: z
    .string()
    .min(8, "Password kam az kam 8 characters ka hona chahiye")
    .regex(/[A-Z]/, "Password mein ek capital letter hona chahiye")
    .regex(/[0-9]/, "Password mein ek number hona chahiye")
    .regex(/[^A-Za-z0-9]/, "Password mein ek special character hona chahiye"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token zaroori hai"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password daalein"),
  newPassword: z
    .string()
    .min(8, "Naya password kam az kam 8 characters ka hona chahiye")
    .regex(/[A-Z]/, "Password mein ek capital letter hona chahiye")
    .regex(/[0-9]/, "Password mein ek number hona chahiye")
    .regex(/[^A-Za-z0-9]/, "Password mein ek special character hona chahiye"),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Naam kam az kam 2 characters ka hona chahiye")
    .max(50)
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
