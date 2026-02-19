# 🔐 Auth System

**Express + TypeScript + PostgreSQL + Prisma + JWT + Zod + Bcrypt**

---

## ✨ Features

| Feature | Detail |
|---------|--------|
| Register / Login | Bcrypt (12 rounds) password hashing |
| Email Verification | Nodemailer se HTML email |
| JWT Access Token | 15 minute expiry |
| JWT Refresh Token | 7 din, token rotation ke saath |
| Forgot / Reset Password | Secure token, 1 ghante expiry |
| Change Password | Login ke baad |
| Role-based Access | USER / ADMIN |
| Rate Limiting | Brute force se protection |
| Helmet | Security headers |
| Zod Validation | Sab inputs validate |
| Pagination | Users list mein |

---

## 📁 Folder Structure

```
auth-system/
│
├── prisma/
│   ├── schema.prisma        # Database models
│   └── seed.ts              # Test data
│
├── src/
│   ├── config/
│   │   └── prisma.ts        # Prisma client
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── emails/
│   │   └── emailService.ts  # HTML email templates
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts      # JWT authenticate + authorize
│   │   ├── error.middleware.ts     # Global error handler
│   │   └── rateLimit.middleware.ts # Rate limiting
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts   # Auth business logic
│   │   └── user.service.ts   # User business logic
│   │
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   │
│   ├── utils/
│   │   ├── apiResponse.ts    # Response helpers
│   │   ├── jwt.ts            # Token helpers
│   │   └── validators.ts     # Zod schemas
│   │
│   └── index.ts              # App entry point
│
├── .env                      # Environment variables
├── docker-compose.yml        # PostgreSQL + pgAdmin
├── package.json
└── tsconfig.json
```

---

## 🚀 Setup - Step by Step

### Step 1: Docker se PostgreSQL start karein
```bash
docker-compose up -d
```

### Step 2: Dependencies install karein
```bash
npm install
```

### Step 3: .env file mein email credentials daalein
```
SMTP_USER=aapki_email@gmail.com
SMTP_PASS=gmail_app_password
```
> Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords

### Step 4: Database setup karein
```bash
npm run prisma:migrate
# Name: init
```

### Step 5: Test data add karein
```bash
npm run prisma:seed
```

### Step 6: Server start karein
```bash
npm run dev
```

✅ Server: http://localhost:3000

---

## 📮 API Endpoints

### Auth (`/api/auth`)

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | `/register` | Naya account | Public |
| GET | `/verify-email/:token` | Email verify | Public |
| POST | `/resend-verification` | Verification email dobara | Public |
| POST | `/login` | Login | Public |
| POST | `/refresh` | Naya access token | Public |
| POST | `/logout` | Logout | Public |
| POST | `/logout-all` | Sab devices logout | 🔐 Login |
| GET | `/me` | Apni info | 🔐 Login |
| POST | `/forgot-password` | Reset email bhejo | Public |
| POST | `/reset-password` | Password change | Public |
| POST | `/change-password` | Password change (logged in) | 🔐 Login |

### Users (`/api/users`)

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| GET | `/profile` | Apni profile | 🔐 Login |
| PATCH | `/profile` | Profile update | 🔐 Login |
| DELETE | `/profile` | Apna account delete | 🔐 Login |
| GET | `/` | Sab users (pagination) | 👑 Admin |
| GET | `/:id` | Ek user | 👑 Admin |
| PATCH | `/:id/role` | Role change | 👑 Admin |
| DELETE | `/:id` | User delete | 👑 Admin |

---

## 📋 Request Examples

### Register
```json
POST /api/auth/register
{
  "name": "Ali Ahmed",
  "email": "ali@example.com",
  "password": "Test@123",
  "role": "USER"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "ali@example.com",
  "password": "Test@123"
}
```

### Protected Route
```
GET /api/users/profile
Authorization: Bearer <accessToken>
```

### Refresh Token
```json
POST /api/auth/refresh
{
  "refreshToken": "..."
}
```

### Admin - Role Change
```json
PATCH /api/users/:id/role
Authorization: Bearer <adminAccessToken>
{
  "role": "ADMIN"
}
```

---

## 🧪 Test Accounts (seed ke baad)

| Role | Email | Password |
|------|-------|---------|
| Admin | admin@test.com | Admin@123 |
| User | user@test.com | User@123 |

---

## 🔒 Security Features

- Bcrypt (salt rounds 12)
- JWT refresh token rotation
- Rate limiting (auth: 10/15min, reset: 3/hour)
- Helmet security headers  
- Email enumeration protection (forgot password)
- All sessions invalidate on password change
- CORS configured

---

## 🐳 Docker Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose stop

# pgAdmin (browser mein DB dekhein)
# URL: http://localhost:5050
# Email: admin@admin.com
# Pass: admin123
```
