export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
