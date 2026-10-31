# THE GYM – Premium Gym Website & Lightweight Management System

A production-ready, high-performance web platform combining a customer-facing brand website with a lightweight gym management operations portal for **THE GYM** in Badshahpur, Sector 69, Gurugram.

---

## 1. Verified Gym Business Information

- **Business Name:** THE GYM
- **Category:** Fitness Center / Gym
- **Address:** Neelkanth Enclave, Plot No. 9, Gali No. 1, Near Ekta Hospital, Badshahpur, Sector 69, Gurugram, Haryana – 122101
- **Contact Number:** `+91 99929 63807`
- **Google Rating:** 5.0 / 5.0 (9 verified Google reviews)
- **Business Description:** THE GYM is a modern fitness center focused on helping people achieve their fitness goals through quality gym equipment, a comfortable workout environment, and a supportive fitness atmosphere.

---

## 2. Technology Stack & Architecture

- **Frontend:**
  - React 18, TypeScript, Vite
  - Tailwind CSS (Dark Charcoal aesthetic with Electric Lime `#ccff00` accents)
  - Framer Motion (smooth entrance & scroll animations)
  - Lucide React (modern icons)
  - React Router v6
  - `html5-qrcode` (device camera real-time attendance barcode scanner)
  - `qrcode.react` (cryptographic QR attendance pass generator)
  - Vite PWA Plugin (offline fallback page, service worker, installable web manifest)

- **Backend:**
  - Python 3.12, FastAPI
  - SQLAlchemy 2.0 ORM
  - Pydantic v2 schemas
  - JWT Bearer Authentication & RBAC (`customer`, `admin`, `staff`)
  - Password Hashing using direct `bcrypt`
  - HMAC SHA256 cryptographic QR attendance signature verification
  - Alembic migrations & standalone PostgreSQL / Supabase `schema.sql`

- **Database:**
  - Cloud Supabase PostgreSQL (production)
  - SQLite zero-configuration local fallback for development

- **Deployment Targets:**
  - **Frontend:** Vercel (configured with `vercel.json` SPA rewrites & cache headers)
  - **Backend:** Render (configured with `render.yaml` free-tier start command)
  - **Database:** Supabase (SQL DDL script in `backend/schema.sql`)

---

## 3. Project Structure

```
THE_GYM/
├── backend/
│   ├── alembic/                      # Database migrations
│   ├── app/
│   │   ├── api/v1/                   # REST API routes
│   │   │   ├── auth.py               # Register, login, me
│   │   │   ├── users.py              # Profile & Admin user CRUD
│   │   │   ├── attendance.py         # QR code issuance & admin camera scanner
│   │   │   ├── memberships.py        # Public plans & Admin plan management
│   │   │   ├── payments.py           # Manual payments, ledger, receipt generation
│   │   │   ├── workouts.py           # Categories, workout routines, member assignments
│   │   │   ├── notifications.py      # Customer alerts & gym announcements
│   │   │   └── dashboard.py          # Admin KPI analytics
│   │   ├── core/                     # Config, DB engine & security utilities
│   │   ├── models/                   # SQLAlchemy 2.0 ORM models
│   │   ├── schemas/                  # Pydantic v2 validation models
│   │   ├── seed.py                   # Initial admin, plans, categories, sample members
│   │   └── main.py                   # FastAPI application factory
│   ├── tests/                        # Automated unit & E2E integration test suite
│   ├── requirements.txt
│   ├── schema.sql                    # Standalone Supabase DDL SQL setup
│   ├── render.yaml                   # Render deployment configuration
│   └── .env.example
├── frontend/
│   ├── public/                       # PWA manifest, icons, offline.html
│   ├── src/
│   │   ├── components/               # Common, Website, Customer, Admin components
│   │   │   ├── common/               # Navbar, Footer, ReceiptModal, NotificationBell
│   │   │   ├── website/              # Hero, About, Plans, Workouts, WhyUs, Location
│   │   │   ├── customer/             # CustomerLayout, QRCard
│   │   │   └── admin/                # AdminLayout, QRScannerModal
│   │   ├── context/                  # AuthContext
│   │   ├── pages/                    # Public, Auth, Customer, Admin routes
│   │   ├── services/                 # Fetch API client
│   │   ├── types/                    # TypeScript interfaces
│   │   ├── utils/                    # Formatters (INR ₹, dates, receipts)
│   │   ├── App.tsx                   # Route definitions
│   │   └── index.css                 # Tailwind typography & dark theme variables
│   ├── vite.config.ts
│   ├── vercel.json                   # Vercel deployment configuration
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 4. Default Seed Accounts (For Testing)

| Role | Email / Login | Password | Phone |
|---|---|---|---|
| **Admin** | `admin@thegym.com` | `AdminPassword@123` | `9992963807` |
| **Staff** | `staff@thegym.com` | `StaffPassword@123` | `9992963808` |
| **Customer** (Active Plan) | `rahul@gmail.com` | `MemberPassword@123` | `9876543210` |
| **Customer** (Partial Fee) | `priya@gmail.com` | `MemberPassword@123` | `9876543211` |
| **Customer** (Half-Yearly) | `amit@gmail.com` | `MemberPassword@123` | `9876543212` |

---

## 5. Local Setup & Execution Guide

### Backend Setup:
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt

# Run seed data:
$env:PYTHONPATH="."
python -m app.seed

# Run automated tests:
pytest tests -v

# Start FastAPI dev server:
uvicorn app.main:app --reload --port 8000
```
Backend will be available at `http://127.0.0.1:8000` with Swagger documentation at `http://127.0.0.1:8000/docs`.

### Frontend Setup:
```bash
cd frontend
npm install

# Run Vite dev server:
npm run dev

# Or build for production:
npm run build
```
Frontend will be available at `http://localhost:5173`.

---

## 6. Key System Features

### 1. Dynamic Public Membership Plans (No Hardcoding)
- Membership plans displayed on the website are fetched in real-time from `GET /api/v1/membership-plans`.
- When an admin adjusts pricing or perks in the Admin Panel (`/admin/plans`), the changes reflect immediately on the public landing page.

### 2. QR Attendance Security & Fraud Prevention
- The customer app fetches a dynamic signed token via `GET /api/v1/attendance/qr`. The token contains `user_id`, a cryptographic `salt`, timestamp, and an HMAC SHA256 signature.
- Customers **cannot mark their own attendance**.
- The staff camera scanner (`/admin/attendance`) decodes and verifies the signature on the backend.
- **Duplicate Check-in Prevention:** The database enforces a unique constraint on `(user_id, attendance_date)`. If scanned twice on the same day, the backend rejects with `409 Conflict: Duplicate scan: [Customer] is already marked present today`.

### 3. Fee & Payment Ledger (No Payment Gateway)
- Clean, manual ledger system for Cash, UPI, and Bank Transfers.
- Tracks total fee, payments made, and remaining balance.
- Generates official computerized receipts with printable layout (`ReceiptModal`).

### 4. Progressive Web App (PWA)
- Installable on Android & iOS home screens.
- Includes `manifest.json`, theme color `#0a0d12`, custom high-resolution icons, and an `offline.html` fallback page.
- Static assets are cached by the Service Worker; sensitive authenticated API responses are never cached.

---

## 7. Production Cloud Deployment

### Supabase (Database):
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and paste the contents of `backend/schema.sql`.
3. Copy your project connection string URI (e.g. `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`).

### Render (Backend):
1. Connect your GitHub repository to [render.com](https://render.com).
2. Create a new **Web Service** with the root directory set to `backend`.
3. Set Environment to **Python**.
4. Set Build Command: `pip install -r requirements.txt`
5. Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `DATABASE_URL`: Your Supabase connection string.
   - `JWT_SECRET_KEY`: A strong random string.
   - `FRONTEND_URL`: Your Vercel frontend URL.

### Vercel (Frontend):
1. Connect your repository to [vercel.com](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://[your-render-backend-url]/api/v1`
4. Deploy! The configured `vercel.json` will manage client-side routing.
