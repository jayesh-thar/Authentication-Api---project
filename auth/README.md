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
| JWT Token Authentication | ✅ Done |
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
│   │   └── auth.middleware.js    ← JWT token verification
│   │
│   ├── models/
│   │   └── user.model.js         ← Mongoose user schema
│   │
│   ├── routes/
│   │   └── auth.route.js         ← All auth endpoints
│   │
│   └── utils/
│       ├── generateToken.js      ← JWT creation + cookie setup
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

# JWT
JWT_SECRET=your_256bit_random_secret_key
JWT_EXPIRES_IN=7d

# Mailtrap Sandbox
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your_mailtrap_username
MAILTRAP_PASSWORD=your_mailtrap_password
MAIL_FROM=noreply@authflow.dev
```

> ⚠️ Never commit `.env` to Git. Always add to `.gitignore`.

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
✅ Generate JWT → store in httpOnly cookie (7 days)
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
✅ Generate JWT → store in httpOnly cookie
✅ Return 200 → success message
```

### 🚪 Logout `POST /logout`

```
Request: (no body needed)
        ↓
✅ Clear token cookie (maxAge: 0)
✅ Return 200 → success message
✅ No DB call required
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
Request: (cookie sent automatically by browser)
        ↓
✅ verifyToken middleware runs first
✅ Read token from req.cookies.token
✅ jwt.verify(token, JWT_SECRET)
✅ Attach decoded.userID → req.userId
✅ Call next() → controller runs
❌ 401 if token missing, invalid, or expired
```

---

## 🧠 User Schema

```javascript
{
  username:               String  (required, trimmed)
  email:                  String  (required, unique, lowercase, regex validated)
  password:               String  (required, min 6 chars, hashed)
  resetPasswordToken:     String  (optional)
  resetPasswordExpiresAt: Date    (optional)
  lastLogin:              Date    (optional)
  createdAt:              Date    (auto — timestamps)
  updatedAt:              Date    (auto — timestamps)
}
```

---

## 🔒 Security Features

### Password Hashing
```
Plain: "hello123"
         ↓ bcryptjs.hash(password, 10)
Hashed: "$2a$10$N9qo8uLOickgx2ZMRZoMye..."

Random salt generated every time
→ Same password = different hash always
→ One way — cannot be reversed
→ bcryptjs.compare() to verify
```

### JWT Token Structure
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySUQiOiIxMjMifQ.abc123
        ↑                      ↑                  ↑
    Header               Payload              Signature
  (algorithm)          (userID + exp)      (secret stamp)
```

### httpOnly Cookie
```
secure: true        → HTTPS only
httpOnly: true      → JS cannot read (XSS protection)
sameSite: 'strict'  → same site only (CSRF protection)
maxAge: 7 days      → auto expiry
```

### Rate Limiting
```
Auth routes → max 10 requests / 15 minutes / per IP
→ Prevents brute force attacks on login
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
verifyToken*          → verify JWT (*protected routes only)
      ↓
Controller            → run business logic
      ↓
Response sent
```

---

## ⏳ Coming Soon

- [ ] CORS Configuration for frontend
- [ ] Helmet.js security headers
- [ ] Redis for persistent rate limiting
- [ ] Refresh token system
- [ ] OAuth — Google & GitHub login
- [ ] Input sanitization (NoSQL injection prevention)
- [ ] Winston logging
- [ ] TypeScript migration
- [ ] Docker setup
- [ ] Email templates with MJML
- [ ] Two-Factor Authentication (2FA)
- [ ] Account deletion flow

---

## 📁 Scripts

```bash
npm run dev     # Start with nodemon (development)
npm start       # Start without nodemon (production)
```

---

## 🧪 Testing with Postman

1. Import all routes into a Postman collection
2. Register a user → check Mailtrap for welcome email
3. Login → check Cookies tab for JWT token
4. Hit `/profile` without token → get 401
5. Hit `/profile` with token → get userId
6. Forgot password → copy token from Mailtrap link
7. Reset password → login with new password ✅

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