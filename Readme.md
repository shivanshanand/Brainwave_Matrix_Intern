# FinSight

A modern, privacy-first personal finance dashboard with clean analytics, AI insights, and a delightful dark UI.

- Track income and expenses smartly
- Analyze monthly, weekly, and category trends
- AI-powered insights
- Authenticated dashboard with protected routes

[Live Demo](https://finsight-vykk.onrender.com)

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Charts: Recharts
- Router: React Router
- State: Zustand
- Dates: date-fns
- Icons: lucide-react
- Notifications: react-toastify

## Features

- Auth
  - Public Welcome page for guests
  - Login/Register with validation and toasts
  - Protected routes (Dashboard, Analytics, Transactions, Insights, Profile)
  - Smart redirect back to intended page after login

- Dashboard
  - Summary cards: income, expenses, net flow, savings rate
  - Quick statistics

- Analytics
  - Monthly trend
  - Category breakdown
  - Weekly spending pattern
  - Custom date ranges
  - Safe rendering guards

- Transactions
  - CRUD for expenses/income

- AI Insights
  - Space for AI-driven tips and summaries

- Profile
  - Centered, minimal profile card with avatar initials, name, username, email
  - Logout
  - Quick access from Navbar avatar/name

- UI/UX
  - Dark theme, subtle gradient background
  - Consistent spacing and safe bottom margins
  - Motion transitions

## Project Structure

- src/pages: Welcome, LoginPage, RegisterPage, Dashboard, Analytics, Transactions, AIInsights, Profile
- src/components: Navbar, ProtectedRoute, RedirectIfAuth, shared UI
- src/store: userStore, expenseStore (Zustand)
- src/routes/App.jsx: Route config and guards
- src/lib: utils/helpers (optional)

---
