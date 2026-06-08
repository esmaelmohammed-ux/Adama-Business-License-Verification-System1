# Adama Business License Verification System

A lightweight internal tool for Adama city revenue inspectors to verify business license payment status in the field.

Inspectors log in, enter a shop's license number on their phone, and the screen turns **green** if paid or **red** with the unpaid balance if expired. Admins can manage records from an office panel. The UI supports **English**, **Amharic**, and **Afaan Oromo**, plus light/dark mode.

## Stack

- **Database:** MySQL 8
- **Backend:** Node.js + Express + JWT auth
- **Frontend:** React + Vite (mobile-first CSS)

## Production deployment (recommended)

The simplest way to deploy is **Docker Compose** — one command runs MySQL, the API, and the built web UI on a single port.

### 1. Configure environment

From the project root:

```bash
cp .env.example .env
```

Edit `.env` and set strong values:

| Variable | Purpose |
|----------|---------|
| `MYSQL_ROOT_PASSWORD` | MySQL root password |
| `MYSQL_PASSWORD` | Password for app DB user |
| `JWT_SECRET` | **Required** — at least 32 random characters |
| `CORS_ORIGIN` | Public URL users open (e.g. `https://audit.adama.gov.et`) |
| `APP_PORT` | Host port (default `5000`) |

Generate a JWT secret (PowerShell):

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 2. Start the stack

```bash
docker compose up -d --build
```

Open `http://your-server:5000` (or your configured port).

### 3. Create the first admin user

Demo accounts are **not** included in production builds. Create real users:

```bash
docker compose exec app node scripts/create-user.js \
  --username admin \
  --password "YourSecurePassword123" \
  --name "Office Administrator" \
  --role admin
```

Create inspectors the same way with `--role inspector`.

### 4. Load business records

Import license data through the **Admin Panel** after logging in, or run `backend/src/db/seed.sql` manually against your database if you need sample records.

### 5. Put HTTPS in front (required for real use)

Place **Nginx**, **Caddy**, or a cloud load balancer in front of the app with TLS. Example Nginx proxy to port 5000:

```nginx
server {
  listen 443 ssl;
  server_name audit.adama.gov.et;

  location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Set `CORS_ORIGIN=https://audit.adama.gov.et` to match your public URL.

### Production checklist

- [ ] Strong `JWT_SECRET` (32+ characters)
- [ ] Strong MySQL passwords
- [ ] HTTPS enabled
- [ ] Demo login buttons hidden (`VITE_SHOW_DEMO=false` — default in Docker build)
- [ ] Real admin/inspector accounts created via `create-user.js`
- [ ] Change or remove any demo business seed data
- [ ] Firewall: expose only 443 (not 3306 publicly)

---

## Manual production (without Docker)

### Database

Run `backend/src/db/schema.sql` on your MySQL server. Do **not** run `users_seed.sql` in production unless you change the default passwords immediately.

### Build and run

```bash
# Frontend
cd frontend
npm install
npm run build

# Copy build into backend
mkdir -p ../backend/public
cp -r dist/* ../backend/public/    # Linux/macOS
# PowerShell: Copy-Item -Recurse dist\* ..\backend\public\

# Backend
cd ../backend
cp .env.example .env               # set NODE_ENV=production, JWT_SECRET, DB_*, CORS_ORIGIN
npm install
npm run create-user -- --username admin --password "YourSecurePassword123" --name "Office Admin" --role admin
NODE_ENV=production npm start
```

The app serves the UI and API together on `PORT` (default 5000).

---

## Local development

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MySQL](https://dev.mysql.com/downloads/) 8+ or XAMPP

### Database setup

**PowerShell (XAMPP):**

```powershell
Get-Content "backend\src\db\schema.sql" -Raw | & "C:\xampp\mysql\bin\mysql.exe" -u root
Get-Content "backend\src\db\seed.sql" -Raw | & "C:\xampp\mysql\bin\mysql.exe" -u root
Get-Content "backend\src\db\users_seed.sql" -Raw | & "C:\xampp\mysql\bin\mysql.exe" -u root
```

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Demo accounts (development only)

| Username | Password | Role |
|----------|----------|------|
| `inspector` | `inspector123` | Field inspector |
| `admin` | `admin123` | Office admin |

---

## API endpoints

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

---

## License active rule

A license is **active** (green) when `payment_status` is `Paid`. The `expiry_date` is shown for reference but does not affect the green/red decision.

---

## Security features (production)

- JWT required for all data endpoints
- Strong `JWT_SECRET` enforced when `NODE_ENV=production`
- Rate limiting on login and general API
- Security headers via Helmet
- Demo account shortcuts hidden in production builds
