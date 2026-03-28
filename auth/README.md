# 🔐 AuthFlow — Production-Grade Authentication API

> *"Every expert was once a beginner who refused to give up."*
> Built from scratch. No copying. No shortcuts. Just understanding — line by line. 🚀

---

## 🌟 What is AuthFlow?

A complete, production-ready **REST API** for user authentication built with **Node.js**, **Express**, and **MongoDB**. Covers everything from registration to password reset — with JWT tokens, httpOnly cookies, email notifications, and rate limiting.

Started with `console.log('hello')` → Ended with a full auth system. 💪

---

## ✨ Features

| Feature | Status |
|---|---|
| User Registration | ✅ Done |
| User Login | ✅ Done |
| User Logout | ✅ Done |
| Access Token (15 min) | ✅ Done |
| Refresh Token (7 days) | ✅ Done |
| Silent Token Refresh | ✅ Done |
| Refresh Token stored in DB | ✅ Done |
| httpOnly Cookie Management | ✅ Done |
| Password Hashing (bcrypt) | ✅ Done |
| Forgot Password Flow | ✅ Done |
| Password Reset via Email | ✅ Done |
| Welcome Email on Register | ✅ Done |
| Protected Routes (Middleware) | ✅ Done |
| Rate Limiting (Brute Force) | ✅ Done |
| Input Validation | ✅ Done |
| Error Handling (try/catch) | ✅ Done |

---

## 🗂️ Project Structure

```
auth/
├── src/
│   ├── config/
│   │   ├── db.js                 ← MongoDB Atlas connection
│   │   └── mailtrap.js           ← Email transporter factory
│   │
│   ├── controllers/
│   │   └── auth.controller.js    ← register, login, logout,
│   │                                forgotPassword, resetPassword
│   ├── middleware/
│   │   └── auth.middleware.js    ← Access + Refresh token verification
│   │
│   ├── models/
│   │   └── user.model.js         ← Mongoose user schema
│   │
│   ├── routes/
│   │   └── auth.route.js         ← All auth endpoints
│   │
│   └── utils/
│       ├── generateToken.js      ← Creates access + refresh tokens
│       └── sendEmail.js          ← Reusable email sender
│
├── .env                          ← Secrets (never commit!)
├── .gitignore                    ← .env + node_modules ignored
├── package.json                  ← type: "module" (ES imports)
└── server.js                     ← Entry point
```

---

## 🔧 Tech Stack

| Package | Purpose |
|---|---|
| `express` | Web server framework |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT creation & verification |
| `cookie-parser` | Read cookies from requests |
| `nodemailer` | Send emails |
| `dotenv` | Environment variables |
| `express-rate-limit` | Rate limiting / brute force protection |
| `nodemon` | Auto-restart in development |

---

## ⚙️ Environment Variables

Create a `.env` file in root:

```env
# Server
PORT=5000
 
# MongoDB Atlas
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
 
# Access Token (short lived)
ACCESS_TOKEN_SECRET=your_256bit_access_secret
ACCESS_TOKEN_EXPIRY=15m
 
# Refresh Token (long lived)
REFRESH_TOKEN_SECRET=your_different_256bit_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
 
# Mailtrap Sandbox
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your_mailtrap_username
MAILTRAP_PASSWORD=your_mailtrap_password
MAIL_FROM=noreply@authflow.dev
```

> ⚠️ Two separate secrets for access and refresh tokens.
> Never use the same secret for both — breaking one would break both.
> Never commit `.env` to Git.

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/authflow.git

# Navigate to project
cd auth

# Install dependencies
npm install

# Create .env file and add your values
cp .env.example .env

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/register` | Register new user | Public |
| `POST` | `/login` | Login existing user | Public |
| `POST` | `/logout` | Logout user | Public |
| `POST` | `/forgot-password` | Request password reset | Public |
| `POST` | `/reset-password/:token` | Reset with token | Public |
| `GET` | `/profile` | Protected route example | 🔒 Private |

---

## 🔄 Auth Flow — Step by Step

### 📝 Register `POST /register`

```
Request: { username, email, password }
        ↓
✅ Validate required fields
✅ Validate email format (regex)
✅ Validate password length (min 6)
✅ Check duplicate email in DB
✅ Hash password → bcryptjs.hash(password, 10)
✅ Save user to MongoDB
✅ Generate access token (15m) + refresh token (7d)
✅ Save refresh token to DB
✅ Store both in httpOnly cookies
✅ Send welcome email via Mailtrap
✅ Return 201 → user data (password excluded)
```

### 🔑 Login `POST /login`

```
Request: { email, password }
        ↓
✅ Validate required fields
✅ Find user by email in DB
✅ bcryptjs.compare(plainPassword, hashedPassword)
✅ Update lastLogin timestamp
✅ Generate access token (15m) + refresh token (7d)
✅ Save refresh token to DB
✅ Store both in httpOnly cookies
✅ Return 200 → success message
```

### 🚪 Logout `POST /logout`

```
Request: (cookies sent automatically)
        ↓
✅ Get refresh token from cookie
✅ Find user by refresh token in DB
✅ Clear refresh token from DB
✅ Clear both cookies (accessToken + refreshToken)
✅ Return 200 → success message
```

### 📧 Forgot Password `POST /forgot-password`

```
Request: { email }
        ↓
✅ Find user by email → 404 if not found
✅ Generate reset token → crypto.randomBytes(32)
✅ Save token + expiry (1 hour) to DB
✅ Send reset email with token link
✅ Return 200 → success message
```

### 🔄 Reset Password `POST /reset-password/:token`

```
Request: { newPassword } + token in URL
        ↓
✅ Find user by token + check expiry ($gt Date.now())
✅ Hash new password with bcryptjs
✅ Update password in DB
✅ Clear resetPasswordToken + resetPasswordExpiresAt
✅ Send password reset success email
✅ Return 200 → success message
```

### 🛡️ Protected Route `GET /profile`

```
Request hits protected route
        ↓
TRY — Check access token:
  ✅ Read from req.cookies.accessToken
  ✅ jwt.verify(accessToken, ACCESS_SECRET)
  ✅ Valid → req.userId = decoded.userID → next()
  ❌ Expired/Invalid → try refresh token
        ↓
CATCH — Refresh token flow:
  ✅ Read from req.cookies.refreshToken
  ✅ jwt.verify(refreshToken, REFRESH_SECRET)
  ✅ User.findOne({ refreshToken }) → verify in DB
  ✅ Create new access token → set new cookie
  ✅ req.userId = user._id → next()
  ❌ Any failure → 401 Session expired
```

---

## 🧠 User Schema

```javascript
{
  username:               String  (required, trimmed)
  email:                  String  (required, unique, lowercase, regex validated)
  password:               String  (required, min 6 chars, hashed)
  refreshToken:           String  (optional — set on login, cleared on logout)
  resetPasswordToken:     String  (optional — for forgot password flow)
  resetPasswordExpiresAt: Date    (optional — 1 hour expiry)
  lastLogin:              Date    (optional — updated on each login)
  createdAt:              Date    (auto — timestamps)
  updatedAt:              Date    (auto — timestamps)
}
```

---

## 🔒 Security Features

### Access + Refresh Token System

```
Single token (old):
  Token stolen → attacker has 7 days ❌
 
Access + Refresh (new):
  Access token stolen  → useless in 15 minutes ✅
  Refresh token stolen → delete from DB on logout → blocked ✅
```

| | Access Token | Refresh Token |
|---|---|---|
| Expiry | 15 minutes | 7 days |
| Stored in | httpOnly cookie | httpOnly cookie + DB |
| Used for | Every request | Getting new access token |
| If stolen | Useless in 15 min | Delete from DB → blocked |

### Cookie Expiry vs JWT Expiry
 
```
Cookie maxAge  → when BROWSER deletes the cookie (client)
JWT expiresIn  → when SERVER rejects the token (server)
→ Two independent systems
→ Token can still be in cookie but server rejects it if JWT expired
```

### Password Hashing

```
"hello123" → bcryptjs.hash(password, 10) → "$2a$10$..."
Random salt every time → same password = different hash always
One way — cannot be reversed → bcryptjs.compare() to verify
```

### httpOnly Cookie

```
secure: true        → HTTPS only
httpOnly: true      → JS cannot read (XSS protection)
sameSite: 'strict'  → same site only (CSRF protection)
```

### Rate Limiting

```
Auth routes → max 10 requests / 15 minutes / per IP
→ Prevents brute force attacks
→ Returns 429 Too Many Requests when exceeded
```

---

## 📧 Email Setup

Using **Mailtrap Sandbox** for development:

```
Your Code → Nodemailer → Mailtrap SMTP → Mailtrap Dashboard
                                         (emails caught here)
                                         (never sent to real users)
```

For production — swap `.env` values to real SMTP:

| Service | Free Tier | Best For |
|---|---|---|
| Mailtrap Live | 1000/month | Small projects |
| Resend | 3000/month | Modern apps |
| SendGrid | 100/day | Large scale |
| Brevo | 300/day | Good free tier |

> Same code — just change `.env` values. 🎯

---

## 💡 Core Concepts Learned

### JWT vs Session
| | JWT (Stateless) | Session (Stateful) |
|---|---|---|
| Storage | Client (cookie) | Server (DB/memory) |
| Scalability | ✅ Easy | ❌ Complex |
| Revocation | ❌ Hard | ✅ Easy |
| Used by | Most modern APIs | Banking apps |

### bcrypt vs SHA256
| | SHA256 | bcrypt |
|---|---|---|
| Salt | ❌ No | ✅ Random every time |
| Same input = same output | ✅ Always | ❌ Never |
| Speed | ⚡ Very fast | 🐢 Slow (intentional) |
| For passwords | ❌ Vulnerable | ✅ Perfect |

### Cookie vs localStorage
| | Cookie | localStorage |
|---|---|---|
| Auto sent with requests | ✅ Yes | ❌ Manual |
| httpOnly option | ✅ Yes | ❌ No |
| XSS safe | ✅ With httpOnly | ❌ Vulnerable |
| Best for | Auth tokens | Non-sensitive data |

---

## 🗺️ Middleware Chain

```
Every Request
      ↓
express.json()        → parse request body
      ↓
cookieParser()        → parse cookies
      ↓
authLimiter           → check rate limit (max 10/15min)
      ↓
authRouter            → match route
      ↓
verifyToken*          → check access token → try refresh if expired
      ↓                 (*protected routes only)
Controller            → run business logic
      ↓
Response sent
```

<!-- ---

## ⏳ Coming Soon

- [ ] Helmet.js security headers
- [ ] Redis for persistent rate limiting
- [ ] Refresh token system *
- [ ] Input sanitization (NoSQL injection prevention)
- [ ] Winston logging
- [ ] Email templates with MJML
- [ ] Two-Factor Authentication (2FA)
- [ ] Account deletion flow --> * 

---

## 📁 Scripts

```bash
npm run dev     # Start with nodemon (development)
npm start       # Start without nodemon (production)
```

---

## 🧪 Testing with Postman

1. Register → check Mailtrap for welcome email → check cookie for both tokens
2. Login → verify `accessToken` + `refreshToken` cookies set
3. Hit `/profile` without token → 401
4. Hit `/profile` with valid cookie → userId returned
5. Wait 15 min OR manually expire → hit `/profile` → auto silent refresh ✅
6. Logout → both cookies cleared + DB refreshToken cleared
7. Hit `/profile` after logout → 401 ✅
8. Forgot password → copy token from Mailtrap → reset password → login ✅

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch → `git checkout -b feature/amazing`
3. Commit changes → `git commit -m 'Add amazing feature'`
4. Push to branch → `git push origin feature/amazing`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 💜 Final Note

> This project was built from complete scratch — understanding every single line.
> Not just copying code — but knowing **why** every decision was made.
>
> From `console.log('hello')` to JWT tokens, bcrypt hashing, email flows,
> rate limiting, and protected routes.
>
> **That's not just a project. That's a mindset.** 🔥
>
> Keep building. Keep breaking things. Keep learning.
> The best is yet to come. 🚀

---

<div align="center">

**Built with 💜 by Jayesh**

*AuthFlow v1.0.0 · 2026*

`Node.js` · `Express` · `MongoDB` · `JWT` · `bcrypt` · `Nodemailer`

</div>