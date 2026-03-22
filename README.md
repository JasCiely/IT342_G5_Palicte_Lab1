# EventWear — Outfit Rental Management System

**IT342 Group 5 | Palicte**

A full-stack outfit rental platform with a Spring Boot backend, React web frontend, and Android mobile app.

---

## Repository Structure

```
IT342_G5_Palicte_Lab1/
├── /web          # React 18 + Vite web frontend
├── /mobile       # Android Kotlin mobile app
├── /backend      # Spring Boot 3 + MySQL backend
├── /docs         # FRS PDF with screenshots and diagrams
├── README.md
└── TASK_CHECKLIST.md
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8.0
- Android Studio (for mobile)

### 1. Backend

```bash
cd backend
# Create MySQL database named 'lab1'
# Update credentials in src/main/resources/application.properties if needed
mvn spring-boot:run
# Runs on http://localhost:8080
```

### 2. Web Frontend

```bash
cd web
npm install
npm run dev
# Runs on http://localhost:5173
```

### 3. Mobile App

```
Open /mobile in Android Studio
Run on emulator (uses 10.0.2.2:8080 to reach backend)
For physical device: update BASE_URL in ApiClient.kt to your machine's local IP
```

---

## Features

| Feature                   | Web | Mobile |
| ------------------------- | --- | ------ |
| Register                  | ✅  | ✅     |
| Login / Logout            | ✅  | ✅     |
| Guest browsing            | ✅  | ✅     |
| Outfit catalog            | ✅  | ✅     |
| Dashboard (authenticated) | ✅  | ✅     |
| Profile view              | ✅  | ✅     |

---

## API Base URL

`http://localhost:8080/api`

Key endpoints: `POST /auth/login` · `POST /auth/register` · `POST /auth/logout` · `GET /outfits`

---

## Tech Stack

- **Backend:** Java 17+, Spring Boot 3, Spring Security, MySQL, Hibernate
- **Web:** React 18, Vite, Axios
- **Mobile:** Kotlin, OkHttp, Material Components for Android
