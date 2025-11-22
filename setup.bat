@echo off
cd /d "%~dp0"
echo ========================================
echo ASIA Mart E-commerce Setup Script
echo ========================================
echo.
echo Working directory: %CD%
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Choose the LTS version and restart your terminal after installation.
    pause
    exit /b 1
)

echo Node.js is installed!
node --version
npm --version
echo.

echo Installing project dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Creating .env file if it doesn't exist...
if not exist .env (
    echo DATABASE_URL="file:./dev.db" > .env
    echo NEXTAUTH_URL="http://localhost:3000" >> .env
    echo NEXTAUTH_SECRET="change-this-to-a-random-string-in-production" >> .env
    echo .env file created!
) else (
    echo .env file already exists, skipping...
)

echo.
echo Setting up database...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)

call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Failed to push database schema
    pause
    exit /b 1
)

call npx prisma db seed
if %errorlevel% neq 0 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Default login credentials:
echo   Admin: admin@asiamart.com / admin123
echo   Customer: customer@example.com / customer123
echo.
pause

