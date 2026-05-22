<div align="center">

# 🪙 Canteen

### Full-Stack Expense Tracking Platform

Track daily spending, analyze habits, and manage personal finances with secure authentication, real-time insights, and user-isolated data storage.

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8" />
</p>

</div>

---

# Overview

Canteen is a modern full-stack expense tracking application designed to help users monitor daily spending patterns through analytics, categorized entries, and real-time dashboards.

The application focuses on:
- Secure authentication
- User-isolated data access
- Real-time financial insights
- Clean and scalable architecture
- Modern responsive UI

---

# Features

## 🔐 Authentication
- Secure sign-up and sign-in using Supabase Auth
- Protected routes and authenticated sessions
- Persistent login state

## 💸 Expense Tracking
- Log expenses with amount, labels, notes, and categories
- Track daily and weekly spending
- Delete entries instantly

## 📊 Analytics Dashboard
- Real-time spending overview
- Recent transaction history
- Highest spending category
- Most frequent spending behavior
- Personalized spending insights

## 🧠 Smart Categorization
Classify expenses into:
- Necessary
- Impulse
- Investment
- Experience

## 🔒 Security
- PostgreSQL database with Supabase
- Row-Level Security (RLS)
- User-specific data isolation
- Protected database operations

---

# Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Supabase | Authentication + Backend |
| PostgreSQL | Database |
| React Router v7 | Routing |
| Tailwind CSS v4 | Styling |

---

# Application Pages

| Route | Description |
|---|---|
| `/auth` | User authentication |
| `/` | Dashboard with analytics and recent activity |
| `/log` | Add a new expense entry |
| `/history` | View all previous transactions |
| `/insights` | Spending analytics and behavioral insights |

---

# Architecture Highlights

- Component-based frontend architecture
- Protected route handling
- Centralized Supabase client setup
- Type-safe interfaces using TypeScript
- Real-time database integration
- Secure backend policies with Row-Level Security

---

# Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Parth424-blip/Canteen.git

cd Canteen
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 4. Run the Development Server

```bash
npm run dev
```

---

# Database Schema

```sql
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount NUMERIC NOT NULL,
  label TEXT NOT NULL,
  vibe_tag TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# Row-Level Security Policies

```sql
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own entries"
ON entries FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own entries"
ON entries FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
ON entries FOR DELETE TO authenticated
USING (auth.uid() = user_id);
```

---

# Folder Structure

```txt
src/
├── lib/
│   └── supabase.ts

├── pages/
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── LogEntry.tsx
│   ├── History.tsx
│   └── Insights.tsx

├── types/
│   └── index.ts

├── App.tsx
└── main.tsx
```

---

# Future Improvements

- Charts and visual analytics
- Budget limits and alerts
- Export transaction history
- Monthly spending reports
- PWA support
- Dark/light theme toggle

---

# Author

**Parth Tiwari**

- GitHub: https://github.com/Parth424-blip
- Portfolio: https://parths-portfolio1.netlify.app/
- Email: tiwariparth339@gmail.com
