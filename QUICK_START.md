# Quick Start Guide

## Step 1: Install Node.js

**If you haven't installed Node.js yet:**

1. Go to: https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer
4. **Important:** Make sure "Add to PATH" is checked during installation
5. **Restart your terminal/PowerShell** after installation

## Step 2: Run Setup

Once Node.js is installed, you have two options:

### Option A: Use the Setup Script (Easiest)
Double-click `setup.bat` or run in terminal:
```bash
setup.bat
```

### Option B: Manual Setup
Run these commands one by one:
```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Step 3: Start the App

### Option A: Use the Start Script
Double-click `start.bat` or run:
```bash
start.bat
```

### Option B: Manual Start
```bash
npm run dev
```

## Step 4: Open in Browser

Navigate to: **http://localhost:3000**

## Login Credentials

**Admin Panel:** http://localhost:3000/admin/dashboard
- Email: `admin@asiamart.com`
- Password: `admin123`

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

## Troubleshooting

### "node is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "npm is not recognized"
- Same as above - Node.js includes npm
- Reinstall Node.js and restart terminal

### Port 3000 already in use
- Next.js will automatically use the next available port
- Check the terminal output for the actual URL

### Database errors
- Delete `prisma/dev.db` if it exists
- Run `npx prisma db push` again

## Need Help?

Check `SETUP.md` for detailed instructions.

