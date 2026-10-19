# Smart Mess Manager - Frontend Web Application

Modern, responsive SaaS web application built with **React**, **Vite**, **Tailwind CSS**, and **Recharts** designed specifically for university students living in shared messes, hostels, and bachelor flats in Bangladesh.

## 🌟 Key Features

- **Bangladeshi Taka (৳ BDT) Calculations**:
  - Live recalculation of Meal Rate = Total Bazar Expenses ÷ Total Meal Units.
  - Shared overhead allocation (Cook/Khala salary, LP gas cylinders, High-Speed WiFi, Utilities).
  - Explicit sign convention: Positive = Credit / Advance, Negative = Due / Deficit.
- **Daily Meal Management**:
  - Bulk Multi-Member Entry Matrix for fast daily recording.
  - Configurable meal units: Breakfast (0.5), Lunch (1.0), Dinner (1.0), and Guest units.
  - 1-click presets: "All 1-1-1", "Lunch & Dinner only", "Clear all".
- **Bazar & Expense Management**:
  - Distinguish between Food/Bazar expenses (included in meal rate) and Shared overhead.
  - Category filters, buyer member association, and receipt logs.
- **Member Deposits & Payments**:
  - Record mobile financial payments (bKash, Nagad, Rocket, Cash, Bank) with TrxID tracking.
- **Monthly Settlement**:
  - Interactive preview and 1-click snapshot finalization with immutable audit trail.
- **Reports & Data Export**:
  - Instant CSV export for member balance sheets, expense ledgers, and deposits.
  - Clean printable format with manager and auditor signature blocks.
- **Dual Mode (Instant Demo Mode + Supabase)**:
  - Works out of the box with realistic Dhaka University mess demo data (`Padma Hall Mess`).
  - Seamlessly connects to Supabase PostgreSQL database when credentials are provided in `.env`.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **Routing**: React Router v7
- **Database/Auth**: Supabase JS Client
- **Testing**: Vitest

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm test

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build
```

Open `http://localhost:5173` in your browser.
