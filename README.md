**Course Connect** is a full-stack, modular, and gamified web app for TU Dublin university students, designed to help you manage tasks, stay focused, and connect with study buddies. The platform uses XP, levels, badges, and leaderboards to keep users engaged and motivated.

---

## 🚀 Features
- **Task Manager:** Kanban board with drag-and-drop, priorities, deadlines, and XP rewards for completing tasks.
- **Focus Timer:** Custom Pomodoro-style timer with XP/points on completion and session history tracking.
- **Flashcards:** Create, flip, and review flashcards; earn XP for each new card created or reviewed.
- **Leaderboard:** See real-time rankings based on points and level.
- **User Profile:** Track your XP, level, streak, badges, and stats. Edit your profile and avatar.
- **Rewards & Badges:** Earn XP, points, and unlock badges for achievements and activity streaks.
- **Notifications:** Instant feedback with toast popups on XP, badges, and level-ups.
- **Authentication:** Secure user authentication with NextAuth.js.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React), Material UI (MUI), Framer Motion, SWR
- **Backend:** Next.js API Routes, Node.js, MongoDB (Mongoose)
- **Auth:** NextAuth.js with JWT sessions
- **Deployment:** Vercel (CI/CD), GitHub
- **Other:** Toastify, bcrypt (password hashing), dotenv (env management)

---

## 📁 Project Structure

```

src/
app/
(protected)/           # All authenticated user pages (dashboard, tasks, timer, profile, etc.)
api/                   # Next.js API endpoints (tasks, rewards, flashcards, etc.)
login/                 # Login and auth pages
register/              # User registration steps
home/                  # Public landing page
...
components/              # Shared React components (Sidebar, Leaderboard, Toasts, etc.)
models/                  # Mongoose schemas for Users, Tasks, Flashcards, etc.
services/                # Business logic (rewardService, notifications, etc.)
utils/                   # DB connection, helpers, XP calculation, etc.
context/                 # React Context (Auth)
lib/                     # Utility libraries (dbConnect, xpUtils)
public/                  # Static assets (images, manifest, icons)
...


Visit (https://course-connect-project-forkrepo-git-main-courseconnect.vercel.app/) to view the app.

---

## 🗂️ API Overview

All backend logic is in `/src/app/api/`.

 `/api/tasks` — CRUD for tasks
 `/api/flashcards` — CRUD for flashcards
 `/api/rewards` — Handle XP/points and leaderboard
 `/api/users` — User data
 `/api/sessions` — Study sessions
 `/api/login`, `/api/register` — Auth endpoints

---

## 🛡️ Security

Passwords are hashed using bcrypt before storing in the database.
JWT sessions are managed by NextAuth.js, protecting all sensitive routes.
Protected routing: Only authenticated users can access main app features.

---

## ✨ Contributing

PRs and suggestions welcome!
Open issues for feature requests or bug reports.

---

## 📝 Credits

Created by the Course Connect team as part of our 3rd year TU Dublin Major Group Project.
