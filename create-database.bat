@echo off
cd /d "%~dp0"
echo ========================================
echo Creating Database
echo ========================================
echo.
echo Working directory: %CD%
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then restart your terminal and run this script again.
    pause
    exit /b 1
)

echo Step 1: Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo Step 2: Creating database schema...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database
    pause
    exit /b 1
)

echo.
echo Step 3: Seeding database with sample data...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database created successfully!
echo ========================================
echo.
echo Database file: prisma\dev.db
echo.
echo You can now run: npm run dev
echo.
pause

