# JORIQUE Backend

Express API for email OTP signup/login, SMTP delivery, and Supabase persistence.

## Setup

1. Create the Supabase tables from `supabase-schema.sql`.
2. Copy `.env.example` to `.env` and fill in Supabase plus SMTP credentials.
3. Install and run:

```bash
npm install
npm run dev
```

By default the API runs at `http://localhost:5000`.

## Endpoints

- `POST /api/auth/signup` creates a pending user and emails an OTP.
- `POST /api/auth/verify-otp` verifies the OTP and returns a JWT session.
- `POST /api/auth/login` logs in verified users.
- `GET /api/auth/me` returns the current user profile.
- `GET /api/dashboard/user` returns dummy user dashboard data.
- `GET /api/dashboard/admin` returns dummy admin dashboard data for admin profiles.
