# 🎨 Auth System — Next.js Frontend

**Next.js 14 + TypeScript + Tailwind + Shadcn/ui**

---

## ✨ Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Email + Password |
| Register | `/register` | Naam, email, password, role |
| Verify Email | `/verify-email?token=...` | Token se verify |
| Forgot Password | `/forgot-password` | Email daalein |
| Reset Password | `/reset-password?token=...` | Naya password |
| Dashboard | `/dashboard` | User overview |
| Profile | `/dashboard/profile` | Naam, password, delete |
| Admin Panel | `/admin` | Stats overview |
| Users Manage | `/admin/users` | Table, delete, role change |

---

## 🚀 Setup

### 1. Backend pehle start karein
```bash
cd auth-system
npm run dev
# http://localhost:3000 pe chalna chahiye
```

### 2. Frontend dependencies install karein
```bash
cd auth-frontend
npm install
```

### 3. .env.local check karein
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Frontend start karein
```bash
npm run dev
# http://localhost:3001 pe khulega
```

---

## 🧪 Test Accounts

| Role | Email | Password |
|------|-------|---------|
| 👑 Admin | admin@test.com | Admin@123 |
| 👤 User | user@test.com | User@123 |

---

## 📁 Structure

```
auth-frontend/
├── app/
│   ├── login/
│   ├── register/
│   ├── verify-email/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── dashboard/
│   │   ├── page.tsx        ← Overview
│   │   └── profile/        ← Settings
│   └── admin/
│       ├── page.tsx        ← Stats
│       └── users/          ← Management
├── components/
│   └── layout/
│       ├── AuthLayout.tsx      ← Auth pages wrapper
│       └── DashboardLayout.tsx ← Dashboard sidebar
├── hooks/
│   └── useAuth.ts          ← Auth state + login/logout
├── lib/
│   ├── api.ts              ← Axios + interceptors
│   └── utils.ts
└── types/
    └── index.ts
```
