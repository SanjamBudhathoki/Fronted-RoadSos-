<div align="center">

# 🚨 RoadSOS — Frontend

**Real-Time Road Emergency Response Web App**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Client-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

> A blazing-fast React web app for road emergency SOS — users send distress signals with GPS, photos and AI analysis; providers receive real-time alerts and track their mission live on the map.

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Key Components](#-key-components)

---

## 🌐 Overview

RoadSOS Frontend is a React + Vite SPA (Single Page Application) that enables:
- **Users** to send SOS requests with location, emergency type, photos and voice notes
- **Providers** to receive real-time alerts, accept missions, and share live GPS
- **Live Map Tracking** of both user and provider positions via Leaflet + Socket.io
- **AI-powered severity insights** displayed on every SOS card
- **Offline SOS fallback** — queues requests when internet is down

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19 + Vite 8** | UI framework & blazing build tool |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router DOM 7** | Client-side routing |
| **React Leaflet + Leaflet Routing Machine** | Interactive maps & navigation |
| **Socket.io Client 4** | Real-time events & live tracking |
| **TanStack React Query 5** | Server state management & caching |
| **Axios** | HTTP client with interceptors |
| **Formik + Yup** | Form handling & validation |
| **React Hot Toast** | Toast notifications |
| **Lucide React** | Icon library |

---

## ✨ Features

- 🆘 **One-tap SOS** — send emergency type, GPS location, notes, and photo
- 🤖 **AI Severity Badge** — Gemini-powered analysis shown on every SOS card
- 🗺 **Live Map Dashboard** — real-time provider GPS updates via Leaflet
- 🔔 **Instant Notifications** — socket-powered bell alerts for new SOS & status changes
- 📡 **Internet Status Detection** — offline banner with queued SOS retry
- 👤 **Dual Role UI** — separate dashboards for Users and Providers
- 🔐 **Protected Routes** — JWT auth with role-based route guards
- 📋 **SOS History** — track all past and active requests with status timeline
- 📍 **Routing Machine** — turn-by-turn route from provider to user on map
- 📸 **Image Evidence** — upload incident photos directly from the SOS form

---

## 📁 Project Structure

```
Fronted-RoadSos--main/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── components/
│   │   ├── Button.jsx              # Reusable button component
│   │   ├── Card.jsx                # Generic card wrapper
│   │   ├── FitBound.jsx            # Auto-fit map bounds
│   │   ├── Footer.jsx              # App footer
│   │   ├── Header.jsx              # Navbar with notification bell
│   │   ├── Input.jsx               # Styled form input
│   │   ├── InternetStatusHook.jsx  # Online/offline detector
│   │   ├── LiveTrackingMaps.jsx    # Real-time map with tracking
│   │   ├── Loader.jsx              # Loading spinner
│   │   ├── LoginForm.jsx           # Login form with Formik
│   │   ├── Logo.jsx                # App logo component
│   │   ├── NotifyBell.jsx          # Real-time notification bell
│   │   ├── ProjectRoute.jsx        # Protected route wrapper
│   │   ├── RegisterForm.jsx        # Registration form
│   │   └── RoutingMachine.jsx      # Leaflet route renderer
│   ├── context/
│   │   ├── AuthContext.jsx         # Global auth state (user/token)
│   │   └── NotificationContext.jsx # Global notification state
│   ├── layout/
│   │   └── MainLayout.jsx          # App shell with Header + Footer
│   ├── pages/
│   │   ├── Home.jsx                # Landing page
│   │   ├── Login.jsx               # Login page
│   │   ├── Register.jsx            # Register page
│   │   ├── UserDashbord.jsx        # User SOS dashboard
│   │   ├── ProviderDashbord.jsx    # Provider mission dashboard
│   │   └── UserProfile.jsx         # Profile & settings page
│   ├── routes/
│   │   ├── login.routes.jsx        # Public-only routes
│   │   └── main.routes.jsx         # Protected app routes
│   ├── services/
│   │   ├── aiService.js            # AI analysis API calls
│   │   ├── authService.js          # Login/register API calls
│   │   ├── axios.js                # Axios instance with auth header
│   │   ├── distanceCalculator.js   # Haversine distance utility
│   │   ├── locationTracking.js     # GPS geolocation service
│   │   ├── offlineSOS.js           # Offline SOS queue (localStorage)
│   │   ├── socket.js               # Socket.io client setup
│   │   └── sosService.js           # SOS CRUD API calls
│   ├── index.css
│   └── main.jsx                    # App entry point
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 🗺 Pages & Routes

| Path | Page | Access | Description |
|------|------|--------|-------------|
| `/` | `Home.jsx` | Public | Landing page with app info |
| `/login` | `Login.jsx` | Guest only | Login form |
| `/register` | `Register.jsx` | Guest only | Registration form |
| `/dashboard` | `UserDashbord.jsx` | Auth (User) | Send SOS, view history |
| `/provider` | `ProviderDashbord.jsx` | Auth (Provider) | Accept SOS, live map |
| `/profile` | `UserProfile.jsx` | Auth | View & edit profile |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- RoadSOS Backend running (see backend README)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Fronted-RoadSos.git
cd Fronted-RoadSos

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your values (see Environment Variables below)

# Start development server
npm run dev
```

App will run at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000

# Socket.io Server URL
VITE_SOCKET_URL=http://localhost:3000
```

---

## 🔑 Key Components

### `LiveTrackingMaps.jsx`
Real-time interactive map component using React Leaflet. Displays user location, provider live position (updated via socket), and renders routing from provider to user using `RoutingMachine`.

### `NotifyBell.jsx`
Socket-powered notification bell that listens for `sos:new`, `sos:accepted`, `sos:completed` events and displays a badge count with dropdown notification list.

### `InternetStatusHook.jsx`
Detects online/offline status. When offline, shows a banner and the `offlineSOS.js` service queues the SOS locally for retry when connection is restored.

### `AuthContext.jsx`
Global React context providing `user`, `token`, `login()`, `logout()` to all components. Persists session to localStorage.

### `ProjectRoute.jsx`
Role-aware protected route wrapper. Redirects unauthenticated users to `/login` and wrong-role users to their correct dashboard.

---

## 📱 User Flow

```
User Opens App
    │
    ├── Register / Login
    │       │
    │       ▼
    │   User Dashboard ──► Create SOS (type + GPS + photo + notes)
    │       │                        │
    │       │               AI analyzes severity
    │       │                        │
    │       └── View SOS History    SOS broadcast to all Providers
    │
    └── Provider Dashboard
            │
            ├── Receive SOS Alert (bell + map pin)
            ├── Accept SOS
            ├── Share Live GPS → user sees on map
            └── Mark Arrived / Complete
```

---

## 👥 Team

Built with ❤️ for Hackathon 2026

---

<div align="center">
  <strong>🚨 RoadSOS — Because every second counts on the road.</strong>
</div>
