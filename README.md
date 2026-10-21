# Blood Bank Donor & Request Management System (PS9)

A comprehensive MERN stack web application for managing blood donors, donor eligibility, blood inventory stock, and emergency blood requests.

---

## 🌐 Live Deployment Links
- **Backend API (Render)**: [https://ps9-blood-bank.onrender.com](https://ps9-blood-bank.onrender.com) (API Base: [https://ps9-blood-bank.onrender.com/api](https://ps9-blood-bank.onrender.com/api))
- **GitHub Repository**: [https://github.com/kjaid0341-creator/PS9_BLOOD_BANK](https://github.com/kjaid0341-creator/PS9_BLOOD_BANK)

---

## 🌟 Key Features

1. **Authentication & Role-Based Access Control**:
   - Secure registration and login using **JWT** tokens and **bcryptjs** password hashing.
   - Dual user roles: **Donor** and **Admin** with strict server-side permission enforcement.

2. **Donor Profile & Automated Eligibility Verification**:
   - Profile management with blood group, date of birth, city, phone number, and last donation date.
   - Real-time eligibility calculator checking:
     - Age criteria: between 18 and 65 years old.
     - Donation gap: at least 90 days (or dynamic admin-configured gap) since the last donation.
     - Displays real-time eligibility status, disqualification reasons, and the exact next eligible donation date.

3. **Blood Inventory & Low-Stock Alerts**:
   - Tracks all 8 standard blood groups: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`.
   - Real-time stock counters with automatic badge alerts for groups with `< 5` units available.

4. **Donation Processing**:
   - Admins record blood donations with donor, units, and donation date.
   - Server-side validation guarantees only eligible donors can donate.
   - Automatically increments stock and updates the donor's `lastDonationDate`.

5. **Emergency Blood Requests Workflow**:
   - Donors or Admins can submit blood requests with patient name, required units, hospital, and deadline.
   - Requesters can edit requests while they remain in `Pending` status.
   - Admins can **Approve**, **Fulfill**, or **Reject** requests.
   - Fulfilling a request automatically checks available units and decrements inventory with protection against insufficient stock or double fulfillment.

6. **Admin Control Dashboard**:
   - Summarizes monthly donations, pending requests count, total registered donors, and blood group inventory with low-stock badges.

---

## 🏗️ Technology Stack

- **Frontend**: React 18 (Vite), React Router DOM (v6), Axios, Pure Modern CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas with Mongoose schemas and atomic operators (`$inc`).
- **Security**: JSON Web Tokens (JWT) & bcryptjs hashing.
- **Deployment**: Render (Backend Web Service) and Vercel (Frontend Static Hosting).

---

## 📁 Project Architecture

```text
ASSIGN-6/
├── backend/
│   ├── config/          # MongoDB Atlas connection (db.js)
│   ├── models/          # Mongoose Schemas (User, Stock, Donation, Request, Setting)
│   ├── controllers/     # Business logic & validations
│   ├── routes/          # Express route definitions
│   ├── middleware/      # JWT auth guard & Admin check middleware
│   ├── utils/           # Eligibility calculation logic
│   ├── seed.js          # Database seeder with realistic test records
│   ├── server.js        # Main Express server entry point
│   ├── .env.example     # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios instance with auth interceptors
│   │   ├── context/     # AuthContext state management
│   │   ├── components/  # Navbar, ProtectedRoute, AdminRoute
│   │   ├── pages/       # All 13 required pages + 404
│   │   ├── App.jsx      # Route definitions
│   │   ├── main.jsx     # App entry point with BrowserRouter
│   │   └── index.css    # Global styling
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Open .env and add your MONGO_URI and JWT_SECRET
```

#### Run Database Seeder (Adds 1 Admin, 10 Donors, Stock & Sample Requests):
```bash
npm run seed
```

#### Start Backend Server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔑 Default Seed Credentials (For Viva / Demo)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@bloodbank.org` | `password123` | Full administrative control |
| **Donor (Eligible)** | `aarav@gmail.com` | `password123` | A+ Blood, last donated 120 days ago |
| **Donor (Ineligible - Gap)** | `sneha@gmail.com` | `password123` | O- Blood, donated 30 days ago |
| **Donor (Ineligible - Age)** | `devansh@gmail.com` | `password123` | Under 18 years of age |

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register a new donor or admin
- `POST /api/auth/login` - Authenticate and obtain JWT
- `GET /api/auth/me` - Fetch authenticated user

### Donors & Eligibility
- `GET /api/donors/me` - Get logged-in donor profile & eligibility
- `GET /api/donors` - Admin directory search (filter by blood group, city, search)
- `GET /api/donors/:id` - Admin view donor detail & donation history

### Donations & Stock
- `POST /api/donations` - Admin records donation (checks eligibility & increments stock)
- `GET /api/donations/my` - Donor donation history
- `GET /api/stock` - View all 8 blood groups and unit availability

### Blood Requests
- `POST /api/requests` - Submit new blood request
- `GET /api/requests/my` - View requester's requests
- `GET /api/requests/:id` - Fetch single request
- `PUT /api/requests/:id` - Edit request (only if `Pending`)
- `GET /api/requests` - Admin view all requests
- `PATCH /api/requests/:id/status` - Admin transition status (`Approved`, `Fulfilled`, `Rejected`)

### System Settings & Dashboard
- `GET /api/settings` & `PUT /api/settings` - Admin configuration for minimum donation gap days
- `GET /api/admin/dashboard/stats` - Aggregated stats for the admin dashboard

---

## 🌐 Production Deployment Steps

### Backend (Render)
1. Push repository to GitHub.
2. In Render, create a new **Web Service** and set the Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random secret string.
   - `NODE_ENV`: `production`

### Frontend (Vercel)
1. In Vercel, import the repository and set Root Directory to `frontend`.
2. Framework Preset: `Vite`.
3. Configure Environment Variables:
   - `VITE_API_URL`: `https://ps9-blood-bank.onrender.com/api`
4. Deploy and verify all routes and live connectivity.
