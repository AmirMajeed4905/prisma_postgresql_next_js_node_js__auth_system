// src/services/user.service.ts
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/error.middleware";
import { UpdateProfileInput } from "../utils/validators";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isEmailVerified: true,
  createdAt: true,
  updatedAt: true,
};

export class UserService {
  // ─────────────────────────────────
  // APNI PROFILE DEKHNA
  // ─────────────────────────────────
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) throw new AppError("User nahi mila", 404);
    return user;
  }

  // ─────────────────────────────────
  // PROFILE UPDATE KARNA
  // ─────────────────────────────────
  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User nahi mila", 404);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { ...(data.name && { name: data.name }) },
      select: userSelect,
    });

    return { message: "Profile update ho gaya", user: updated };
  }

  // ─────────────────────────────────
  // ADMIN: SAB USERS DEKHNA
  // ─────────────────────────────────
  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        select: userSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─────────────────────────────────
  // ADMIN: EK USER DEKHNA
  // ─────────────────────────────────
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) throw new AppError("User nahi mila", 404);
    return user;
  }

  // ─────────────────────────────────
  // ADMIN: ROLE CHANGE KARNA
  // ─────────────────────────────────
  async updateUserRole(userId: string, role: "USER" | "ADMIN") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User nahi mila", 404);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: userSelect,
    });

    return { message: `User ka role ${role} kar diya gaya`, user: updated };
  }

  // ─────────────────────────────────
  // ADMIN: USER DELETE KARNA
  // ─────────────────────────────────
  async deleteUser(userId: string, requestingUserId: string) {
    if (userId === requestingUserId) {
      throw new AppError("Aap apna apna account delete nahi kar saktay", 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User nahi mila", 404);

    await prisma.user.delete({ where: { id: userId } });
    return { message: `User ${user.email} delete ho gaya` };
  }

  // ─────────────────────────────────
  // APNA ACCOUNT DELETE KARNA
  // ─────────────────────────────────
  async deleteOwnAccount(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User nahi mila", 404);

    await prisma.user.delete({ where: { id: userId } });
    return { message: "Aap ka account delete ho gaya" };
  }
}

export const userService = new UserService();
