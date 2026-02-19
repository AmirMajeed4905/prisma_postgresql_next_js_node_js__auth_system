import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - token add karo
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - token expire pe refresh karo
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        Cookies.set("accessToken", data.tokens.accessToken, { expires: 1 / 96 }); // 15 min
        original.headers.Authorization = `Bearer ${data.tokens.accessToken}`;
        return api(original);
      } catch {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── AUTH API ───────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  logout: (refreshToken: string) =>
    api.post("/auth/logout", { refreshToken }),

  me: () => api.get("/auth/me"),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email/${token}`),

  resendVerification: (email: string) =>
    api.post("/auth/resend-verification", { email }),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/auth/change-password", { currentPassword, newPassword }),
};

// ─── USER API ───────────────────────────────────
export const userApi = {
  getProfile: () => api.get("/users/profile"),

  updateProfile: (data: { name?: string }) =>
    api.patch("/users/profile", data),

  deleteAccount: () => api.delete("/users/profile"),

  // Admin
  getAllUsers: (page = 1, limit = 10) =>
    api.get(`/users?page=${page}&limit=${limit}`),

  getUserById: (id: string) => api.get(`/users/${id}`),

  updateRole: (id: string, role: string) =>
    api.patch(`/users/${id}/role`, { role }),

  deleteUser: (id: string) => api.delete(`/users/${id}`),
};
