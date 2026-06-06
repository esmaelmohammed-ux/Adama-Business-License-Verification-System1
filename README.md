# Adama Business License Verification System

A lightweight internal tool for Adama city revenue inspectors to verify business license payment status in the field.

Inspectors log in, enter a shop's license number on their phone, and the screen turns **green** if paid or **red** with the unpaid balance if expired. Admins can manage records from an office panel. The UI supports **English**, **Amharic**, and **Afaan Oromo**.

## Stack

- **Database:** MySQL
- **Backend:** Node.js + Express + JWT auth
- **Frontend:** React + Vite (mobile-first CSS, bilingual UI)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MySQL](https://dev.mysql.com/downloads/) 8+ or XAMPP

## Database Setup

**PowerShell (XAMPP):**

```powershell
Get-Content "backend\src\db\schema.sql" -Raw | & "C:\xampp\mysql\bin\mysql.exe" -u root
Get-Content "backend\src\db\seed.sql" -Raw | & "C:\xampp\mysql\bin\mysql.exe" -u root
Get-Content "backend\src\db\users_seed.sql" -Raw | & "C:\xampp\mysql\bin\mysql.exe" -u root
```

If you already ran `schema.sql` before users were added, run only:

```powershell
Get-Content "backend\src\db\users_schema.sql" -Raw | & "C:\xampp\mysql\bin\mysql.exe" -u root
Get-Content "backend\src\db\users_seed.sql" -Raw | & "C:\xampp\mysql\bin\mysql.exe" -u root
```

## Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API runs at `http://localhost:5000`.

### Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| `inspector` | `inspector123` | Field inspector (license lookup) |
| `admin` | `admin123` | Office admin (lookup + manage records) |

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/business/:license_number` | JWT | License lookup |
| GET | `/api/admin/businesses` | Admin | List all businesses |
| POST | `/api/admin/businesses` | Admin | Create business |
| PUT | `/api/admin/businesses/:id` | Admin | Update business |
| DELETE | `/api/admin/businesses/:id` | Admin | Delete business |

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` — you will be redirected to the login page.

### Features

- **Inspector login** — JWT-based, 8-hour sessions
- **Field audit** — mobile-friendly green/red license lookup
- **Admin panel** — add, edit, delete business records (`/admin`, admin only)
- **Multilingual UI** — language toggle in the top navigation (English / አማርኛ / Afaan Oromoo)

## Demo License Numbers

| License | Status | Balance |
|---------|--------|---------|
| `ADM-2024-0001` | Paid (green) | ETB 0 |
| `ADM-2024-0002` | Expired (red) | ETB 3,500 |

## License Active Rule

A license is **active** (green) when `payment_status` is `Paid`. The `expiry_date` is shown for reference but does not affect the green/red decision.
