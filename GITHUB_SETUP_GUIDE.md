# GitHub Setup and Deployment Guide

## Prerequisites
- Git installed on your system
- GitHub account created
- Node.js and npm installed on both systems

---

## Part 1: Upload Project to GitHub (Current System)

### Step 1: Initialize Git Repository
Open terminal in your project directory and run:
```bash
cd d:\parth
git init
```

### Step 2: Configure Git (First time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Add All Files to Git
```bash
git add .
```

### Step 4: Create First Commit
```bash
git commit -m "Initial commit - Client Ledger System"
```

### Step 5: Create GitHub Repository
1. Go to https://github.com
2. Click the "+" icon in top right → "New repository"
3. Repository name: `client-ledger-system` (or your preferred name)
4. Description: "Full-stack accounting application for managing client accounts"
5. Choose "Public" or "Private"
6. **DO NOT** check "Initialize with README" (we already have code)
7. Click "Create repository"

### Step 6: Link Local Repository to GitHub
Copy the commands shown on GitHub after creating the repository, they will look like:
```bash
git remote add origin https://github.com/YOUR_USERNAME/client-ledger-system.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Part 2: Download and Setup on Another System

### Step 1: Clone Repository
On the new system, open terminal and run:
```bash
git clone https://github.com/YOUR_USERNAME/client-ledger-system.git
cd client-ledger-system
```

### Step 2: Install Frontend Dependencies
```bash
cd my-react-app
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd backend
npm install
cd ../..
```

### Step 4: Setup PostgreSQL Database
1. Install PostgreSQL on the new system
2. Create a new database:
```sql
CREATE DATABASE accounting_db;
```
3. Run the schema creation script:
```bash
psql -U postgres -d accounting_db -f database_schema.sql
```

Or manually in pgAdmin:
- Open pgAdmin
- Create database "accounting_db"
- Open Query Tool
- Copy and paste contents of `database_schema.sql`
- Execute the script

### Step 5: Configure Backend Environment Variables
Create `.env` file in `my-react-app/backend/` directory:
```bash
cd my-react-app/backend
```

Create `.env` file with following content:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=accounting_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432
PORT=5000
```

Replace `your_postgres_password` with your actual PostgreSQL password.

### Step 6: Start Backend Server
```bash
cd my-react-app/backend
npm run dev
```

### Step 7: Start Frontend (New terminal)
```bash
cd my-react-app
npm run dev
```

### Step 8: Verify Setup
1. Backend should be running on http://localhost:5000
2. Frontend should be running on http://localhost:5173
3. Test database connection: http://localhost:5000/api/test-db
4. Open frontend in browser and test creating a client

---

## Part 3: Clean Transactions (Optional)

If you want to start with a clean database (no transaction data):

### Option A: Before Pushing to GitHub
On your current system:
```sql
TRUNCATE TABLE clients, transactions CASCADE;
```

Then commit and push:
```bash
git add .
git commit -m "Clean database - removed all transactions"
git push
```

### Option B: After Downloading on New System
On the new system, run in PostgreSQL:
```sql
TRUNCATE TABLE clients, transactions CASCADE;
```

---

## Part 4: Making Changes and Syncing

### On Current System (After Making Changes)
```bash
git add .
git commit -m "Description of changes"
git push
```

### On New System (To Get Latest Changes)
```bash
git pull
```

---

## Important Notes

1. **Never commit `.env` files** - They contain sensitive information and are in .gitignore
2. **Always create `.env` manually** on each new system with appropriate credentials
3. **Database is separate** - Each system will have its own PostgreSQL database
4. **Logo file** - Make sure LOGO.png is in `my-react-app/public/` folder
5. **Port conflicts** - Make sure ports 5000 and 5173 are available on the new system

---

## Troubleshooting

### If frontend cannot connect to backend:
Check `my-react-app/src/services/api.js` - baseURL should be `http://localhost:5000`

### If database connection fails:
1. Verify PostgreSQL is running
2. Check credentials in `.env` file
3. Test connection: `psql -U postgres -d accounting_db`

### If npm install fails:
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

---

## Quick Reference Commands

```bash
# Check Git status
git status

# See commit history
git log

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# See all branches
git branch -a

# Pull latest changes
git pull

# Push changes
git push
```
