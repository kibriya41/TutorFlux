<div align="center">

# 🎓 TutorFlux

**Book Expert Tutors Online — Learn. Grow. Excel.**

A premium tutor-booking platform where students can discover verified expert tutors and book personalized 1-on-1 learning sessions instantly. Built with Next.js 16, React 19, and a polished animated UI.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![HeroUI](https://img.shields.io/badge/HeroUI-3-FF4D2E?logoColor=white)](https://heroui.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](#contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Backend API](#-backend-api)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**TutorFlux** connects students with expert tutors for personalized online learning. Students can browse tutor profiles, filter by subject, price, and availability, book sessions, and manage their bookings — all in a fast, modern, and animated interface.

> This repository contains the **frontend** (Next.js client). It communicates with a separate REST API backend for tutor and booking data, and uses **Better Auth** backed by **MongoDB** for authentication.

---

## ✨ Features

### 👨‍🎓 For Students
- **Browse Tutors** — Explore a grid/list of expert tutor cards with photos, ratings, subjects, and pricing.
- **Search & Filter** — Instantly filter tutors by keyword, subject, and date range, plus sort (recommended, price, rating).
- **Tutor Details** — View full profiles with teaching style, experience, availability, and hourly fees.
- **Book Sessions** — Reserve a 1-on-1 slot with a single click; slots decrement in real time.
- **My Booked Sessions** — View and cancel upcoming bookings.
- **Favorites** — Save tutors to a favorites list for quick access.

### 👨‍🏫 For Tutors
- **Add Tutor Profile** — Submit a detailed profile (name, photo, subject, location, experience, availability, fee, total slots).
- **My Tutors** — Manage the tutor profiles you've created.
- **Edit / Delete** — Update or remove your tutor listings at any time.

### 🔐 Accounts
- **Authentication** — Email/password sign-up and login, plus Google OAuth.
- **Profile** — Edit your profile and view your activity stats.

### 🎨 UI / UX
- Fully **responsive** (mobile-first) layout.
- Smooth **Framer Motion** animations and micro-interactions.
- **Dark mode** aware styling with Tailwind CSS v4.
- Animated counters, hover effects, and toast notifications (`react-hot-toast`).
- Custom 404 not-found page.

---

## 🛠 Tech Stack

| Layer        | Technology |
|--------------|------------|
| Framework    | [Next.js 16](https://nextjs.org/) (App Router, React Compiler) |
| UI Library   | [React 19](https://react.dev/) |
| Components   | [HeroUI](https://heroui.com/) (formerly NextUI) |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations   | [Framer Motion](https://www.framer.com/motion/) |
| Icons        | [Lucide](https://lucide.dev/), [`@gravity-ui/icons`](https://gravity-ui.com/icons/), [`react-icons`](https://react-icons.github.io/react-icons/) |
| Notifications| [react-hot-toast](https://react-hot-toast.com/) |
| Auth         | [Better Auth](https://www.better-auth.com/) + `@better-auth/mongo-adapter` |
| Database     | [MongoDB](https://www.mongodb.com/) |
| Font         | [Geist](https://vercel.com/font) (via `next/font`)

---

## 📁 Project Structure

```
tutor-flux/
├── public/                     # Static assets (logo, images, icons)
│   ├── logo.png
│   └── images/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js           # Root layout (Navbar, Footer, Toaster)
│   │   ├── page.js             # Home / Hero landing page
│   │   ├── globals.css         # Global styles + Tailwind
│   │   ├── not-found.jsx       # Custom 404 page
│   │   ├── tutors/
│   │   │   ├── page.jsx        # Browse all tutors (search/filter/sort)
│   │   │   └── [id]/page.jsx   # Tutor details + booking
│   │   ├── add-tutor/page.jsx  # Add a new tutor profile
│   │   ├── my-tutors/page.jsx  # Tutors created by the user
│   │   ├── booked/page.jsx     # User's booked sessions
│   │   ├── profile/page.jsx    # Profile + stats
│   │   ├── login/page.jsx      # Login page
│   │   ├── register/page.jsx   # Registration page
│   │   └── api/auth/[...all]/route.js  # Better Auth route handler
│   ├── components/
│   │   ├── Hero.jsx            # Landing hero section
│   │   ├── Profile.jsx
│   │   ├── EditTutor.jsx
│   │   ├── DeleteTutor.jsx
│   │   └── shared/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       ├── NavLink.jsx
│   │       └── CustomTrigger.jsx
│   └── lib/
│       ├── auth.js             # Better Auth server config
│       └── auth-client.js      # Better Auth client config
├── next.config.mjs
├── jsconfig.json               # `@/*` path alias → ./src/*
├── eslint.config.mjs
├── postcss.config.mjs
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 20.0.0`
- **npm** (comes with Node) — or `yarn` / `pnpm`
- A running **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- (Optional) Google OAuth credentials for social login

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kibriya41/TutorFlux.git
   cd TutorFlux
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root (see [Environment Variables](#-environment-variables)).

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env` file at the project root with the following keys:

```env
# Better Auth
BETTER_AUTH_SECRET=your-random-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/tutorflux

# Google OAuth (optional — for social login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`. Generate a strong secret for `BETTER_AUTH_SECRET` (e.g., via `openssl rand -base64 32`).

---

## 📜 Available Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start the development server (HMR).      |
| `npm run build` | Create an optimized production build.    |
| `npm run start` | Start the production server (after build).|
| `npm run lint`  | Run ESLint on the project.               |

---

## 🔌 Backend API

The frontend consumes a **separate REST API** hosted on Render:

```
https://tutorflux-serve-2.onrender.com
```

| Method   | Endpoint                          | Purpose                          |
|----------|-----------------------------------|----------------------------------|
| `GET`    | `/tutors`                         | Fetch all tutors (supports query filters) |
| `GET`    | `/tutor/:id`                      | Fetch a single tutor's details   |
| `POST`   | `/tutor`                          | Create a new tutor profile       |
| `GET`    | `/my-tutors?email=...`            | Tutors created by a user         |
| `POST`   | `/booking`                        | Book a session                   |
| `GET`    | `/my-bookings?email=...`          | User's bookings                  |
| `PATCH`  | `/booking/:id/cancel`             | Cancel a booking                 |
| `POST`   | `/jwt`                            | Issue a JWT on login             |

> The backend repository is maintained separately. Update the base URL in the client code if you self-host.

---

## 🔐 Authentication

TutorFlux uses [**Better Auth**](https://www.better-auth.com/) with the MongoDB adapter:

- **Email & password** sign-up/sign-in
- **Google OAuth** social login
- Server config → [`src/lib/auth.js`](src/lib/auth.js)
- Client config → [`src/lib/auth-client.js`](src/lib/auth-client.js)
- Route handler → [`src/app/api/auth/[...all]/route.js`](src/app/api/auth/%5B...all%5D/route.js)

---

## ☁️ Deployment

The easiest way to deploy this Next.js app is on [**Vercel**](https://vercel.com/) (the creators of Next.js).

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Add all [Environment Variables](#-environment-variables) in the Vercel dashboard (use your production URLs for `BETTER_AUTH_URL` / `NEXT_PUBLIC_BETTER_AUTH_URL`).
4. Deploy.

Other platforms that support Node.js / Next.js (Netlify, Render, Railway, a Node VPS) also work — run `npm run build` followed by `npm run start`.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more.

---

## 🤝 Contributing

Contributions are welcome! 🎉

1. **Fork** the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**.

Please run `npm run lint` before submitting a PR.

---

## 📄 License

This project is open-sourced under the **MIT License**. Feel free to use, modify, and distribute it.

---

<div align="center">

**Made with ❤️ for learners worldwide.**

[Report a bug](https://github.com/kibriya41/TutorFlux/issues) · [Request a feature](https://github.com/kibriya41/TutorFlux/issues) · [⭐ Star on GitHub](https://github.com/kibriya41/TutorFlux)

</div>
