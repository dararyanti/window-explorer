# Windows Explorer

A full-stack project that mimics a Windows Explorer-style interface.  
This monorepo contains both **backend** and **frontend** apps, managed with [Bun](https://bun.sh/) and npm scripts for parallel development.

---

## 📂 Project Structure

```
windows-explorer/
├── apps/
│   ├── backend/    # Backend service (API, business logic)
│   └── frontend/   # Frontend app (UI)
├── package.json
└── README.md
```

---

## 🚀 Tech Stack

- **Frontend:** Modern JavaScript/TypeScript (Bun)
- **Backend:** Bun runtime
- **Package Manager:** [Bun](https://bun.sh/) & npm
- **Scripts Manager:** `npm-run-all`
- **TypeScript:** ^5 (peer dependency)

---

## 🔧 Setup & Installation

### 1. Install Bun
Follow the official guide:  
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies
```bash
bun install
```

---

## ▶️ Development

You can run the backend and frontend separately or in parallel.

### Create Database
bunx prisma migrate dev

### Insert Data Template
bunx prisma db seed

### Run Backend Only
```bash
bun run dev:backend
```

### Run Frontend Only
```bash
bun run dev:frontend
```

### Run Both (Parallel)
```bash
bun run dev
```

---

## 📜 Scripts

| Script            | Description                                  |
|-------------------|----------------------------------------------|
| `dev:backend`     | Start backend development server             |
| `dev:frontend`    | Start frontend development server            |
| `dev`             | Run backend and frontend together in parallel|

---
