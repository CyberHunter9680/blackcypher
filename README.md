# Black‑Cypher — Premium Cybersecurity Platform

> Enterprise-grade cybersecurity training platform with hands-on labs, live sessions, and community features.

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-ijf3ytgh)

---

## 🔐 About

**Black Cypher** is a full-stack cybersecurity learning platform built for the next generation of security professionals. It offers structured courses, live doubt sessions, community messaging, and an admin control panel — all secured with encrypted communications and role-based access.

---

## ✨ Features

- 📚 **Courses & Learning Paths** — Structured CEH-level cybersecurity curriculum
- 💬 **Secure Messaging** — End-to-end encrypted real-time chat between users
- 🔔 **Real-time Notifications** — Live database-backed notification system (no mock data)
- 👥 **Community** — Forums, threads, and direct messaging with `@username#1234` search
- 🛡️ **Admin Dashboard** — Full user registry, course manager, and platform analytics
- 🔑 **Unique User Identity** — Every user gets a unique `@handle#discriminator` on signup
- 📹 **Live Sessions** — Scheduled doubt support and mentorship sessions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | PostgreSQL (Neon) |
| Auth | Firebase Authentication |

---

## 🚀 Recent Updates

- Removed fake statistics (Students, Courses, Job Placement) from Home and About pages
- Notification dropdown now fetches real data from `/api/notifications`
- Chat search now works by **username, display name, or `#discriminator`** — newly created accounts are instantly searchable
- Every new user is automatically assigned a unique `@username#discriminator` on account creation
- Admin dashboard shows all users with their unique handles

---

## 🔧 Local Development

```bash
npm install
npm run dev
```

---

## 👥 Team

| Name | Role |
|------|------|
| Abhishek Sharma | Founder & CEO \| Cyber Security Trainer |
| Deepak Dubat | CO-Founder \| Security Architect |

---

© 2026 Black Cypher. All rights reserved.
