// src/middleware/rateLimit.middleware.ts
import rateLimit from "express-rate-limit";

// General rate limit - sab routes ke liye
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Aap ne bohat zyada requests ki hain. 15 minute baad koshish karein.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth routes ke liye strict limit
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Bohat zyada login attempts. 15 minute baad koshish karein.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset ke liye aur bhi strict
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ghanta
  max: 3,
  message: {
    success: false,
    message: "Aap ne 3 baar try kar liya. 1 ghante baad koshish karein.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
