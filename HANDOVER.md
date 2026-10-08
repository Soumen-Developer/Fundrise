# 🚀 FundRise — Project Handover & Deployment Documentation

---

## 📌 Executive Summary

**FundRise** is a crowdfunding and community donation web application built with a modern, high-performance tech stack:
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, and React Router v7.
- **Backend**: Node.js, Express 5, Sequelize ORM, PostgreSQL (with automatic zero-config SQLite resilience fallback).
- **Security & Auth**: JWT-based session tokens with HTTP cookies and Bearer headers, bcryptjs password hashing, Helmet headers, CORS policies, and rate-limiting.
- **Payments**: Razorpay payment flow with interactive simulated test mode.
- **DevOps**: Multi-stage Docker containerization, automated database migrations (`alter: true`), automated post-deployment seeding, and Render Blueprint deployment.

---

## 🌐 Live Production Deployment

| Property | Details |
| :--- | :--- |
| **Live Web URL** | [https://fundrise-zbdj.onrender.com](https://fundrise-zbdj.onrender.com) |
| **Render Service ID** | `srv-db3jah5g1s2s73an0230` |
| **Render Project** | `Fundrise` (`prj-db3ikabtqb8s73e5lt80`) |
| **Region** | `Singapore` (`sin`) |
| **Runtime** | Docker (Alpine Node 20 Multi-Stage) |
| **Healthcheck Endpoints** | `GET /health` and `GET /api/health` |
| **Deployment Status** | **Live & Operational** |

---

## 🔐 Production Environment Variables

These environment variables are configured in the Render production service:

```env
NODE_ENV=production
PORT=5000
AUTO_SEED=true
JWT_SECRET=fundrise_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
```

### Optional External Database:
* **With Render Managed PostgreSQL**: Add `DATABASE_URL=postgres://fundrise:password@dpg-xxxxx:5432/fundrise` using the **Internal Database URL** from the database settings.
* **Without External PostgreSQL**: Omit `DATABASE_URL` (or leave it blank). The application will automatically initialize the high-performance internal SQLite engine and run with zero configuration.

---

## 👥 Pre-seeded Accounts & Credentials

The automated post-deployment seeder (`backend/seed.js`) automatically provisions the following accounts:

| Role | Name | Email | Password | Access / Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Soumen Developer | `soumen@fundrise.com` | `soumen123` | Full Admin Dashboard, Campaign Approvals/Rejections, User Management |
| **Admin** | Yogiraj Admin | `yogiraj@fundrise.com` | `yogiraj123` | Full Admin Dashboard, Platform Metrics, User Management |
| **Admin** | Admin User | `admin@fundrise.com` | `admin123` | Full Admin Dashboard, System Control |
| **User** | Priya Sharma | `priya@example.com` | `password123` | Campaign Creator, Donor, Dashboard User |
| **User** | Rohit Verma | `rohit@example.com` | `password123` | Campaign Creator, Donor |
| **User** | Amit Patel | `amit@example.com` | `password123` | Donor, Commenter |

> 💡 **Quick Login**: The `/login` page features **one-click auto-fill buttons** for Soumen (Admin), Yogiraj (Admin), System Admin, and Priya (User).

---

## 💎 Key Features & Implementation Highlights

1. **Indian Rupee (`₹`) Standardization**:
   - Strictly replaced all dollar signs with the official Indian Rupee (`₹`) symbol across campaigns, explore pages, payment modals, receipts, and dashboards.

2. **Interactive Demo Payment Simulator**:
   - Integrated `DemoPaymentModal` into the campaign donation flow.
   - Accessible via quick-donate shortcuts on campaign cards, campaign detail pages, and creator confirmation modals.
   - Simulates UPI (GPay, PhonePe, Paytm), NetBanking, and Card transactions with realistic loading spinners and instant receipt generation.

3. **Campaign Creation & Celebratory Confirmation**:
   - Interactive creation form with category selection, image upload, goal amounts, and deadline settings.
   - Once submitted, creators are greeted by a celebratory confirmation modal with live copyable links, direct donation simulator links, and dashboard navigation.

4. **Creator & User Dashboard (`/dashboard`)**:
   - Real-time campaign tracking, total raised funds, backer metrics, and goal progress bars.
   - Donation history table showing campaign titles, transaction dates, payment IDs, and downloadable donation receipts.

5. **Admin Dashboard (`/admin`)**:
   - Live platform stats: Total Raised, Total Backers, Total Campaigns, Pending Approvals.
   - Campaign Approval/Rejection queue with custom reason prompts.
   - Platform campaigns management with clean hover styling.
   - User account management (block/unblock toggle, role verification).

6. **Preserved Branding & Footer**:
   - Full navigation bar with user profile badges and soft logout states.
   - Strictly preserved social media community links (Twitter/X, Facebook, Instagram, LinkedIn, GitHub).

---

## ⚙️ Local Development & Scripts

### 1. Single-Command Startup (Frontend + Backend)
To clear any locked ports (`5000`, `5001`, `5173`, `5174`) and launch both frontend and backend concurrently:
```bash
# In the root repository directory
npm run dev
# or
npm run dev:all
```

### 2. Individual Service Commands
```bash
# Clear locked ports
npm run clean:ports

# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# Build frontend production bundle
npm run build

# Run automated post-deployment migrations & seeding
npm run postdeploy

# Seed database standalone
npm run seed

# Start production server
npm start
```

---

## 🐳 Docker Architecture

The project features an optimized multi-stage `Dockerfile`:
- **Stage 1 (Builder)**: Builds the React 19 SPA using Vite into `/app/frontend/dist`.
- **Stage 2 (Runner)**: Minimal Node.js 20 Alpine image running Express 5, serving both the REST API and the static React SPA bundle with client-side SPA routing fallbacks.
- **Port**: Exposed on port `5000` (configurable via `PORT` environment variable).

### Local Docker Commands:
```bash
# Build the production Docker image
docker build -t fundrise .

# Run the container locally
docker run -p 5000:5000 --env-file .env fundrise

# Run with Docker Compose (includes managed Postgres)
docker-compose up --build
```

---

## 🛠️ Render Blueprint Configuration (`render.yaml`)

```yaml
# Render Blueprint - FundRise Platform
databases:
  - name: fundrise-db
    databaseName: fundrise
    user: fundrise
    region: singapore
    plan: free

services:
  - type: web
    name: fundrise-web
    runtime: docker
    region: singapore
    plan: free
    dockerfilePath: ./Dockerfile
    dockerContext: .
    healthCheckPath: /api/health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: "5000"
      - key: DATABASE_URL
        fromDatabase:
          name: fundrise-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: AUTO_SEED
        value: "true"
      - key: RAZORPAY_KEY_ID
        sync: false
      - key: RAZORPAY_KEY_SECRET
        sync: false
      - key: BCRYPT_SALT_ROUNDS
        value: "10"
```

---

## 📂 Repository Structure

```
fundrise/
├── Dockerfile                   # Multi-stage production container manifest
├── docker-compose.yml           # Local multi-container Docker compose
├── render.yaml                  # Render Infrastructure-as-Code Blueprint
├── package.json                 # Monorepo scripts (clean:ports, dev, postdeploy)
├── .env.example                 # Reference environment variables template
├── HANDOVER.md                  # Complete project handover documentation
│
├── backend/
│   ├── config/
│   │   └── db.js                # Sequelize connection with retry & SQLite fallback
│   ├── middleware/              # Auth, validation, error handling
│   ├── models/                  # User, Campaign, Donation, Comment, Update
│   ├── routes/                  # REST API routes (auth, campaign, donation, admin)
│   ├── scripts/
│   │   └── postdeploy.js        # Automated schema sync and seed execution
│   ├── utils/                   # JWT helpers, receipts generator
│   ├── seed.js                  # Idempotent demo and admin seeder
│   └── server.cjs               # Express 5 server listening on 0.0.0.0
│
└── frontend/
    ├── src/
    │   ├── components/          # Navbar, Footer, CampaignCard, PaymentModal
    │   ├── pages/               # HomePage, Explore, CampaignDetail, Create, Dashboards
    │   ├── context/             # AuthContext, ThemeContext
    │   └── services/            # Axios API client
    ├── index.html
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🏁 Verification & QA Summary

- ✅ **Live API & Health**: Both `/health` and `/api/health` return HTTP 200 with database status `dbConnected: true`.
- ✅ **Live Campaigns**: `GET /api/campaigns` returns populated, verified campaigns with real images and realistic metrics.
- ✅ **Live Authentication**: All admin (`soumen@fundrise.com`, `yogiraj@fundrise.com`, `admin@fundrise.com`) and user accounts authenticate and receive valid JWT tokens.
- ✅ **SPA Routing**: Direct link navigations (`/`, `/explore`, `/login`, `/dashboard`, `/admin`) resolve to `index.html` without 404 errors.
- ✅ **Docker Integrity**: Multi-stage build completes with 0 warnings and sub-second cached builds.
