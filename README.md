# Odoo HRMS (Enterprise Edition)

**Odoo HRMS** is an elegant, premium SaaS architecture designed for real-time tracking, touchless payroll, heatmaps, and secure digital identities. Built as part of the Adamas University Hackathon 2026, it offers a dual-portal system for both Employees and HR Administrators.

## 🚀 Features

- **Role-Based Access Control:** Distinct, secure portals for Employees and HR Administrators.
- **Real-Time Dashboards:** Dynamic widgets tracking headcount, daily attendance, and leave requests.
- **Employee Directory:** Complete workforce management with instant profile viewing.
- **Attendance & Time Tracking:** Daily check-in/check-out tracking and logging.
- **Leave Management:** Request workflow, history tracking, and manager approvals.
- **Touchless Payroll:** Automated salary ledger, basic pay, bonuses, and deduction calculations.
- **Secure Document Vault:** Upload and verify identity documents, contracts, and certifications.
- **Premium UI:** Glassmorphism design system with fluid animations and responsive layouts.

## 🛠️ Tech Stack

### Frontend
- **HTML5, CSS3, Vanilla JavaScript:** Ultra-fast, lightweight single-page application structure.
- **Vite:** Next-generation frontend tooling and local dev server.
- **Lucide Icons & Chart.js:** For crisp UI elements and beautiful data visualization.

### Backend
- **Node.js & Express.js:** High-performance, scalable API server.
- **TypeScript:** Strict type-checking for robust backend logic.
- **MongoDB & Mongoose:** Flexible and scalable NoSQL database.
- **JWT (JSON Web Tokens):** Secure, stateless user authentication.
- **Helmet & CORS:** Advanced security middleware.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas URI)

### 1. Backend Setup

Navigate to the Backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory with your configurations:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGIN=http://127.0.0.1:3001
```

Start the backend development server:
```bash
npm run dev
```
*(The server will start on `http://localhost:5001`)*

### 2. Frontend Setup

Navigate to the Frontend directory and install dependencies:
```bash
cd Frontend
npm install
```

Start the Vite development server:
```bash
npm run frontend
```
*(The frontend will be available at `http://127.0.0.1:3001`)*

---

## 👥 Usage

1. Open your browser to `http://127.0.0.1:3001`.
2. Choose your role on the Landing Page ("I am an Employee" or "I am an HR Admin").
3. Create a new account using the Sign-Up form.
4. Log in to access your designated dashboard and features.

---

## 📄 License

This project was developed for the Adamas University Hackathon 2026. All rights reserved.
