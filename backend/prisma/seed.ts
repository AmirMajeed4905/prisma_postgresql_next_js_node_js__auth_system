// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Database seed ho raha hai...");

  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@test.com",
      password: adminPassword,
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  const userPassword = await bcrypt.hash("User@123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@test.com",
      password: userPassword,
      role: "USER",
      isEmailVerified: true,
    },
  });

  console.log("✅ Seed complete!");
  console.log("─────────────────────────────────");
  console.log("👑 Admin  →  admin@test.com  |  Admin@123");
  console.log("👤 User   →  user@test.com   |  User@123");
  console.log("─────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
