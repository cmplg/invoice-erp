# Invoice ERP Installation Guide

This package contains the Invoice ERP application built with Next.js and Prisma.

## Contents

- `app/` — Next.js application pages and API routes
- `components/` — UI components and PDF generator
- `lib/` — Prisma and utility helpers
- `prisma/` — database schema and migrations
- `package.json` — dependencies and scripts
- `INSTALLATION.md` — this installation guide

## Requirements

- Node.js 18 or later
- npm 10 or later
- PostgreSQL database (or another supported database if configured)

## Setup

1. Extract the zip package.
2. Open a terminal in the extracted folder.
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root folder with your database connection string. Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

5. Run Prisma migrations:

```bash
npx prisma migrate deploy
```

6. Generate the Prisma client:

```bash
npx prisma generate
```

7. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Ubuntu Installation

### Install Node.js

Open a terminal and run:

```bash
sudo apt update
sudo apt install -y curl build-essential
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Confirm versions:

```bash
node -v
npm -v
```

### Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Create a database user and database:

```bash
sudo -u postgres createuser invoice_user
sudo -u postgres createdb invoice_db --owner=invoice_user
sudo -u postgres psql -c "ALTER USER invoice_user WITH PASSWORD 'password';"
```

### Run the application

1. Extract the zip.
2. Install dependencies: `npm install`
3. Create `.env` with `DATABASE_URL`.
4. Run migrations: `npx prisma migrate deploy`
5. Start app: `npm run dev`

---

## Windows Installation

### Install Node.js

1. Download Node.js LTS from https://nodejs.org/
2. Install using the Windows installer.
3. Open PowerShell and verify:

```powershell
node -v
npm -v
```

### Install PostgreSQL

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install PostgreSQL and create a database user.
3. Use `pgAdmin` or `psql` to create the database.

### Run the application

1. Extract the zip package.
2. Open PowerShell in the project folder.
3. Install dependencies:

```powershell
npm install
```

4. Create `.env` with the database URL.
5. Run migrations:

```powershell
npx prisma migrate deploy
```

6. Generate client:

```powershell
npx prisma generate
```

7. Start the application:

```powershell
npm run dev
```

---

## Raspberry Pi Installation

### Install Node.js

Use the NodeSource setup script for Raspberry Pi OS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

### Install PostgreSQL

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Create a database user and database:

```bash
sudo -u postgres createuser invoice_user
sudo -u postgres createdb invoice_db --owner=invoice_user
sudo -u postgres psql -c "ALTER USER invoice_user WITH PASSWORD 'password';"
```

### Run the application

1. Extract the zip.
2. In the project folder, run:

```bash
npm install
```

3. Create `.env` with the proper `DATABASE_URL`.
4. Deploy migrations and generate the client:

```bash
npx prisma migrate deploy
npx prisma generate
```

5. Start the app:

```bash
npm run dev
```

Access the site from a browser at `http://<raspberry-pi-ip>:3000`.

---

## Notes

- If you use a different database connection, update the `DATABASE_URL` in `.env` accordingly.
- For production deployments, use `npm run build` and `npm start` or a proper process manager.
- The application is configured for server-side rendering and API routes.
