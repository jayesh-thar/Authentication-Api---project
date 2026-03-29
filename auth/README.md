# 🔐 AuthFlow — Production-Grade Authentication API

> *"Every expert was once a beginner who refused to give up."*
> Built from scratch. No copying. No shortcuts. Just understanding — line by line. 🚀

---

## 🌟 What is AuthFlow?

A complete, production-ready **REST API** for user authentication built with **Node.js**, **Express**, and **MongoDB**. Covers everything from registration to account deletion — with Access + Refresh JWT tokens, token rotation, httpOnly cookies, email notifications, rate limiting, and protected routes.

Started with `console.log('hello')` → Ended with a full production auth system. 💪

---

## ✨ Features

| Feature | Status |
|---|---|
| User Registration | ✅ Done |
| User Login | ✅ Done |
| User Logout | ✅ Done |
| Account Deletion (with email confirmation) | ✅ Done |
| Access Token (15 min) | ✅ Done |
| Refresh Token (7 days) | ✅ Done |
| Refresh Token Rotation | ✅ Done |
| Silent Token Refresh | ✅ Done |
| Refresh Token stored in DB | ✅ Done |
| httpOnly Cookie Management | ✅ Done |
| Password Hashing (bcrypt) | ✅ Done |
| Forgot Password Flow | ✅ Done |
| Password Reset via Email | ✅ Done |
| Welcome Email on Register | ✅ Done |
| Password Reset Success Email | ✅ Done |
| Account Deletion Confirmation Email | ✅ Done |
| Protected Routes (Middleware) | ✅ Done |
| Rate Limiting (Brute Force Protection) | ✅ Done |
| Email Format Validation (Regex) | ✅ Done |
| Input Validation | ✅ Done |
| Error Handling (try/catch) | ✅ Done |
| Last Login Tracking | ✅ Done |

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
│   │                                forgotPassword, resetPassword,
│   │                                deleteAccount, confirmDelete
│   ├── middleware/
│   │   └── auth.middleware.js    ← Access + Refresh token verification
│   │                                with token rotation
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
| `bcryptjs` | Password hashing with salt rounds |
| `jsonwebtoken` | JWT creation & verification |
| `cookie-parser` | Read cookies from incoming requests |
| `nodemailer` | Send transactional emails |
| `dotenv` | Environment variable management |
| `express-rate-limit` | Rate limiting / brute force protection |
| `nodemon` | Auto-restart in development |
| `crypto` | Built-in Node.js — secure random token generation |

---

## ⚙️ Environment Variables

Create a `.env` file in root:

```env
# Server
PORT=5000

# MongoDB Atlas
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Access Token (short lived — 15 minutes)
ACCESS_TOKEN_SECRET=your_256bit_access_secret
ACCESS_TOKEN_EXPIRY=15m

# Refresh Token (long lived — 7 days)
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
> Never use the same secret for both — breaking one breaks both.
> Never commit `.env` to Git. Always add to `.gitignore`.

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
| `POST` | `/reset-password/:token` | Reset password with token | Public |
| `GET` | `/profile` | Protected route example | 🔒 Private |
| `DELETE` | `/delete-account` | Request account deletion | 🔒 Private |
| `POST` | `/confirm-delete/:token` | Confirm account deletion | Public |

---

## 🔄 Auth Flows — Step by Step

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
✅ Generate new access token (15m) + new refresh token (7d)
✅ Save new refresh token to DB (overwrites old)
✅ Store both in httpOnly cookies
✅ Return 200 → success message
```

### 🚪 Logout `POST /logout`

```
Request: (cookies sent automatically by browser)
        ↓
✅ Get refresh token from req.cookies.refreshToken
✅ Find user by refresh token in DB
✅ Clear refresh token from DB (user.refreshToken = undefined)
✅ Clear both cookies (accessToken + refreshToken → maxAge: 0)
✅ Return 200 → success message
```

### 🛡️ Protected Route — Middleware Flow

```
Request hits protected route (e.g. /profile)
        ↓
TRY — Check access token:
  Read from req.cookies.accessToken
  No token? → 401 "Please Login"
  jwt.verify(accessToken, ACCESS_SECRET)
  Valid → req.userId = decoded.userID → next() ✅
  Expired/Invalid → catch runs
        ↓
CATCH — Refresh token flow (with rotation):
  Read from req.cookies.refreshToken
  No token? → 401 "Please login again"
  jwt.verify(refreshToken, REFRESH_SECRET)
  User.findOne({ refreshToken }) → verify exists in DB
  Not found? → 401 "Invalid session"
        ↓
  ROTATION:
  Delete old refresh token from DB
  Create NEW refresh token → save to DB
  Set new refresh token cookie
        ↓
  Create new access token → set new cookie
  req.userId = user._id → next() ✅
        ↓
INNER CATCH — If refresh flow fails:
  → 401 "Session expired - Please login again"
```

### 📧 Forgot Password `POST /forgot-password`

```
Request: { email }
        ↓
✅ Find user by email → 404 if not found
✅ Generate reset token → crypto.randomBytes(32).toString('hex')
✅ Save token + expiry (1 hour) to DB
✅ Send reset email with token link
✅ Return 200 → "Check your email"
```

### 🔄 Reset Password `POST /reset-password/:token`

```
Request: { newPassword } + token in URL params
        ↓
✅ Validate newPassword field
✅ Find user → token match + expiry check ($gt Date.now())
✅ Not found? → 400 "Invalid or expired token"
✅ Hash new password → bcryptjs.hash(newPassword, 10)
✅ Update password in DB
✅ Clear resetPasswordToken + resetPasswordExpiresAt
✅ Send password reset success email
✅ Return 200 → success message
```

### 🗑️ Delete Account `DELETE /delete-account`

```
Request: (must be logged in — verifyToken middleware runs first)
        ↓
✅ Get userId from req.userId (set by middleware)
✅ Find user by userId
✅ Generate delete confirmation token → crypto.randomBytes(32)
✅ Save token + expiry (15 minutes) to DB
✅ Send confirmation email with token link
✅ Return 200 → "Check your email to confirm deletion"
```

### ✅ Confirm Delete `POST /confirm-delete/:token`

```
Request: token in URL params
        ↓
✅ Find user → token match + expiry check ($gt Date.now())
✅ Not found? → 400 "Invalid or expired token"
✅ User.findByIdAndDelete(user._id) → permanently deleted
✅ Clear both cookies (accessToken + refreshToken)
✅ Return 200 → "Account deleted successfully"
```

---

## 🧠 User Schema

```javascript
{
  username:                String  (required, trimmed)
  email:                   String  (required, unique, lowercase, regex validated)
  password:                String  (required, min 6 chars, always hashed)
  refreshToken:            String  (optional — set on login, cleared on logout)
  resetPasswordToken:      String  (optional — for forgot password flow)
  resetPasswordExpiresAt:  Date    (optional — 1 hour expiry)
  accountDeleteToken:      String  (optional — for account deletion confirmation)
  accountDeleteExpiryAt:   Date    (optional — 15 minutes expiry)
  lastLogin:               Date    (optional — updated on each login)
  createdAt:               Date    (auto — mongoose timestamps)
  updatedAt:               Date    (auto — mongoose timestamps)
}
```

---

## 🔒 Security Features

### Access + Refresh Token System

```
Single token (old approach):
  Token stolen → attacker has 7 days of full access ❌

Access + Refresh (current approach):
  Access token stolen  → useless in 15 minutes ✅
  Refresh token stolen → logout clears from DB → blocked ✅
```

| | Access Token | Refresh Token |
|---|---|---|
| Expiry | 15 minutes | 7 days |
| Stored in | httpOnly cookie only | httpOnly cookie + DB |
| Purpose | Every API request | Getting new access token |
| If stolen | Auto-expires in 15 min | Logout clears from DB |
| Stateless | ✅ Yes | ❌ No (needs DB) |

### Refresh Token Rotation

```
WITHOUT rotation:
  Same refresh token reused forever → stolen token works indefinitely ❌
  Both attacker and real user logged in simultaneously → undetectable

WITH rotation:
  Every refresh → old token deleted → new token issued
  Attacker uses stolen token first → real user's token invalidated
  Real user gets 401 → knows something is wrong ✅
  Theft detected automatically
```

### Cookie Expiry vs JWT Expiry

```
Two completely independent systems:

Cookie maxAge  → BROWSER deletes cookie at this time
JWT expiresIn  → SERVER rejects token after this time

→ Token can still exist in cookie but server rejects it if JWT expired
→ Logout (maxAge: 0) tells browser to delete cookie immediately
→ JWT expiry is baked inside token string — never deleted, just rejected
```

### Password Hashing (bcrypt)

```
"hello123" → bcryptjs.hash(password, 10) → "$2a$10$randomsalt..."

Random salt generated every time
→ Same password = different hash always
→ One way — mathematically impossible to reverse
→ bcryptjs.compare() extracts salt from hash → rehashes → compares
→ 10 rounds = intentionally slow → brute force takes years
```

### httpOnly Cookies

```
httpOnly: true    → JavaScript cannot read cookie → XSS protection
secure: true      → HTTPS only → no plain HTTP transmission
sameSite: strict  → only sent to same origin → CSRF protection
```

### Rate Limiting

```
Auth routes → max 10 requests / 15 minutes / per IP
→ Prevents brute force login attacks
→ Prevents password reset email spam
→ Returns 429 Too Many Requests when exceeded
→ Tracked by IP address in memory
```

---

## 📧 Email System

Using **Mailtrap Sandbox** for development — emails never reach real users:

```
Your Code → Nodemailer → Mailtrap SMTP → Mailtrap Dashboard ✅
                         (sandbox catches all — safe for testing)
```

### Emails Sent

| Trigger | Subject | Contains |
|---|---|---|
| Register | Welcome to MyApp 🎉 | Username, email, get started button |
| Forgot Password | Reset Password Request | Reset link (1hr expiry) |
| Reset Password | Password Reset Successful ✅ | Reset time, security warning |
| Delete Account | Account Deletion Request | Confirmation link (15min expiry) |

### Switch to Production

Just change `.env` values — code stays exactly the same:

| Service | Free Tier | Best For |
|---|---|---|
| Mailtrap Live | 1000/month | Small projects |
| Resend | 3000/month | Modern apps |
| SendGrid | 100/day | Large scale |
| Brevo | 300/day | Good free tier |

---

## 💡 Core Concepts

### JWT vs Session

| | JWT (Stateless) | Session (Stateful) |
|---|---|---|
| Storage | Client (cookie) | Server (DB/memory) |
| Scalability | ✅ Easy | ❌ Complex |
| Revocation | ⚠️ Hard (use refresh token) | ✅ Easy |
| DB call per request | ❌ No | ✅ Yes |
| Used by | Most modern APIs | Banking apps |

### bcrypt vs SHA256

| | SHA256 | bcrypt |
|---|---|---|
| Salt | ❌ No salt | ✅ Random salt every time |
| Same input → same output | ✅ Always | ❌ Never |
| Speed | ⚡ Very fast | 🐢 Intentionally slow |
| Rainbow table safe | ❌ Vulnerable | ✅ Protected |
| For passwords | ❌ Never use | ✅ Always use |

### Cookie vs localStorage

| | Cookie | localStorage |
|---|---|---|
| Auto sent with requests | ✅ Yes | ❌ Manual |
| httpOnly option | ✅ Yes (JS can't read) | ❌ No |
| XSS attack safe | ✅ With httpOnly | ❌ Vulnerable |
| Expiry control | ✅ maxAge | ❌ Manual |
| Best for | Auth tokens | Non-sensitive data |

---

## 🗺️ Middleware Chain

```
Every Incoming Request
        ↓
express.json()          → parse JSON request body
        ↓
cookieParser()          → parse cookies → available as req.cookies
        ↓
authLimiter             → check rate limit (10 req/15min per IP)
        ↓
authRouter              → match URL to route
        ↓
verifyToken*            → check accessToken → if expired try refreshToken
        ↓                  with rotation (*protected routes only)
Controller              → run business logic
        ↓
Response sent to client
```

---

## 🧪 Testing with Postman

```
1. Register new user
   → Check Mailtrap for welcome email
   → Check Cookies tab for accessToken + refreshToken

2. Login
   → Verify both tokens in cookies
   → Check lastLogin updated in MongoDB

3. Hit /profile without token → 401 Unauthorized

4. Hit /profile with valid cookie → { userId: '...' }

5. Logout
   → Both cookies cleared
   → refreshToken removed from DB
   → Hit /profile → 401 ✅

6. Forgot Password
   → Copy token from reset link in Mailtrap
   → POST /reset-password/TOKEN with { newPassword }
   → Login with new password ✅

7. Delete Account
   → DELETE /delete-account (must be logged in)
   → Copy token from confirmation email
   → POST /confirm-delete/TOKEN
   → Check MongoDB — user gone ✅
   → Try login → should fail ✅
```

---

## 📁 Scripts

```bash
npm run dev     # Start with nodemon (auto-restart on changes)
npm start       # Start without nodemon (production)
```

---

## ⏳ Coming Soon

- [ ] CORS configuration for frontend connection
- [ ] Helmet.js security headers
- [ ] Redis for persistent rate limiting (survives server restart)
- [ ] OAuth — Google & GitHub login
- [ ] Input sanitization (NoSQL injection prevention)
- [ ] Winston logging (structured production logs)
- [ ] TypeScript migration
- [ ] Docker setup + deployment
- [ ] Two-Factor Authentication (2FA)
- [ ] Role-based access control (RBAC)

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
> From `console.log('hello')` to JWT access + refresh tokens, token rotation,
> bcrypt hashing, email flows, rate limiting, protected routes, and account deletion.
>
> 35+ real bugs debugged. 40+ concepts mastered. 0 lines copy-pasted.
>
> **That's not just a project. That's a mindset.** 🔥
>
> Keep building. Keep breaking things. Keep learning.
> The best is yet to come. 🚀

---

<div align="center">

**Built with 💜 by Jayesh**

*AuthFlow v1.2.0 · 2026*

`Node.js` · `Express` · `MongoDB` · `JWT` · `bcrypt` · `Nodemailer` · `Mailtrap`

</div>
