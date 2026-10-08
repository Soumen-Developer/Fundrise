# FundRise - Crowdfunding Platform

A modern crowdfunding platform where people can create fundraising campaigns for startups, social causes, medical help, education, creative projects, and environment. Built with React 19 + Vite + TypeScript + Tailwind CSS on the frontend, and Express 5 + Sequelize + PostgreSQL on the backend.

## 📖 Project Abstract

FundRise is a crowdfunding platform that bridges the gap between people who want to support meaningful causes and those who need financial assistance. The platform enables creators to launch campaigns for various categories including education, medical emergencies, startups, creative projects, social causes, and environmental initiatives. With a focus on transparency, security, and user experience, FundRise ensures that every contribution counts towards real impact.

## 🛠️ Tech Stack

### Frontend
- **React 19** (Vite) - Fast, modern React development
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **Framer Motion** - Smooth animations and micro-interactions
- **lucide-react** - Beautiful, consistent icons
- **Recharts** - Data visualization for dashboards
- **react-hot-toast** - Toast notifications

### Backend
- **Node.js** + **Express 5** - RESTful API server
- **PostgreSQL** + **Sequelize** - Database and ORM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Razorpay** - Payment integration (TEST MODE)
- **express-rate-limit** - Rate limiting

### Development
- **TypeScript** - Type-safe code
- **dotenv** - Environment variable management
- **nodemon** - Development server with auto-reload
- **Docker** - Containerized deployment

## ✨ Features

### User Features
- **Authentication**: Sign up, login, logout with JWT and bcrypt
- **Campaign Management**: Create, edit, delete campaigns (before donations received)
- **Browsing**: Search campaigns by title, filter by category, sort by most funded/ending soon/newest
- **Donations**: Donate via Razorpay test mode with preset amounts (₹100, ₹500, ₹1000) and custom amounts
- **Comments**: Add and view comments on campaigns
- **Profile Dashboard**: Track your campaigns and donations
- **Dark Mode**: Toggle between light and dark themes

### Admin Features
- **Platform Statistics**: Total users, campaigns, funds raised, pending approvals
- **Campaign Management**: Approve/reject campaigns with reasons
- **User Management**: Block/unblock users
- **Charts**: Donations over time and campaigns by category

### Trust & Credibility
- Verified badges for approved campaigns
- Secure payment processing via Razorpay
- 72-hour reply window (not teardown window)
- Downloadable donation receipts
- Real-time progress tracking

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (local or remote)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/fundrise.git
   cd fundrise
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```
   NODE_ENV=development
   PORT=5000
   
   DATABASE_URL=postgresql://fundrise:fundrise_pass@localhost:5432/fundrise
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=fundrise
   DB_USER=fundrise
   DB_PASSWORD=fundrise_pass
   
   JWT_SECRET=fundrise_jwt_secret_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   
   RAZORPAY_KEY_ID=rzp_test_your_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
   
   BCRYPT_SALT_ROUNDS=12
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Start Development Servers**
   ```bash
   # Start backend
   cd backend
   npm run dev
   
   # Start frontend (in a new terminal)
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 📊 Seed Data

To populate the database with sample data, run:

```bash
cd backend
npm run seed
```

This will create:
- 1 Admin user (admin@fundrise.com / password: admin123)
- 4 Regular users (priya, rohit, amit, sunita @example.com / password123)
- 6 realistic campaigns across categories
- 10 sample donations
- 5 campaign updates/comments

### Test Login Credentials

| Role | Email | Password |
|------|-------|----------|
| User | priya@example.com | password123 |
| User | rohit@example.com | password123 |
| User | amit@example.com | password123 |
| User | sunita@example.com | password123 |
| Admin | admin@fundrise.com | admin123 |

## 💳 Razorpay Test Mode

The platform uses Razorpay in TEST MODE only. No real money transactions occur.

### Test Card Details
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date (e.g., 12/34)
- **CVV**: 123
- **Name**: Any name
- **Bank**: Select any bank

### Test Scenarios
- **Successful payment**: Use any 4-digit expiry and CVV
- **Failed payment**: Use random numbers that fail validation
- **Payment verification**: Signature verification is handled server-side

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user profile | Private |
| POST | `/api/auth/logout` | Logout user | Private |

### Campaign Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/campaigns` | Create new campaign | Private (user/admin) |
| GET | `/api/campaigns` | List campaigns with filters | Public |
| GET | `/api/campaigns/:id` | Get campaign details | Public |
| PUT | `/api/campaigns/:id` | Edit campaign (creator only, before donations) | Private |
| DELETE | `/api/campaigns/:id` | Delete campaign (creator only, before donations) | Private |

### Donation Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/donations/create-order` | Create Razorpay order | Private |
| POST | `/api/donations/verify` | Verify payment & save donation | Private |
| GET | `/api/donations/user/:userId` | Get user's donations | Private (owner/admin) |
| GET | `/api/donations/campaign/:campaignId` | Get campaign donations | Public |

### Comment Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/comments` | Add comment to campaign | Private |
| GET | `/api/comments/campaign/:campaignId` | Get comments for campaign | Public |

### Update Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/updates` | Create campaign update | Private (creator) |

### Response Formats

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  ...(development only) { stack: "..." }
}
```

## 🌓 Dark Mode

The application supports dark mode with automatic theme detection and user preference persistence. Toggle the moon/sun icon in the navbar to switch themes.

## 📱 Responsive Design

The platform is mobile-first and responsive at:
- **320px** - Mobile phones
- **768px** - Tablets
- **1024px** - Small laptops
- **1440px** - Desktops

Touch-friendly buttons (minimum 44px height) and keyboard-navigable elements.

## 🔐 Security

- Environment variables for all secrets
- bcrypt password hashing (12 salt rounds)
- JWT authentication with httpOnly cookies
- Input validation on frontend and backend
- Role-based access control
- Central error handling
- Rate limiting for auth endpoints

## 📦 Available Scripts

### Backend
- `npm run start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Lint check
- `npm run typecheck` - TypeScript type check

## 📄 License

This project is for educational purposes as a college project.

## 👥 Authors

Your Name - Initial work

## 🙏 Acknowledgments

- Design inspiration from Kickstarter, GoFundMe, Ketto, and Milaap
- Color palette and typography from design system specifications
- Icon set from lucide-react
- Payment gateway integration with Razorpay
- Containerization with Docker

---

**FundRise** - Small Contributions, Big Change.