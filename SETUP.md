# Quick Setup Guide - SQLite Version

This project has been configured to use SQLite, which means **no database server installation required**!

## Prerequisites

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - During installation, make sure "Add to PATH" is checked

## Installation Steps

### 1. Install Node.js
- Download and install Node.js from https://nodejs.org/
- Restart your terminal/PowerShell after installation

### 2. Verify Installation
Open a new terminal/PowerShell and run:
```bash
node --version
npm --version
```
Both commands should show version numbers.

### 3. Install Project Dependencies
In your project directory, run:
```bash
npm install
```

### 4. Set Up Environment Variables
Create a `.env` file in the root directory with:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

**Note:** You can use any random string for `NEXTAUTH_SECRET`. For example:
```
NEXTAUTH_SECRET="my-super-secret-key-12345-change-this-in-production"
```

### 5. Set Up Database
Run these commands to create the database and seed it with sample data:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 6. Start the Development Server
```bash
npm run dev
```

### 7. Open in Browser
Navigate to: http://localhost:3000

## Default Login Credentials

After seeding the database, you can login with:

**Admin Panel:**
- Email: `admin@asiamart.com`
- Password: `admin123`
- Access: http://localhost:3000/admin/dashboard

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

## Troubleshooting

### "node is not recognized"
- Make sure Node.js is installed
- Restart your terminal/PowerShell
- Check if Node.js is in your PATH: `where.exe node`

### Database errors
- Make sure you ran `npx prisma generate` and `npx prisma db push`
- Delete `prisma/dev.db` and run the setup commands again

### Port already in use
- If port 3000 is busy, Next.js will automatically use the next available port
- Check the terminal output for the actual URL

## Next Steps

1. **Change the default passwords** in production
2. **Update NEXTAUTH_SECRET** with a secure random string
3. **Add your own products** through the admin panel
4. **Customize the branding** and styling

## File Structure

- Database file: `prisma/dev.db` (SQLite database - created automatically)
- Environment: `.env` (create this file)
- Source code: `app/` directory
- Components: `components/` directory

Enjoy your e-commerce platform! 🚀

