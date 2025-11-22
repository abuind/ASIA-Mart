@echo off
cd /d "%~dp0"
echo Starting ASIA Mart E-commerce...
echo.
echo Working directory: %CD%
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

if not exist node_modules (
    echo Dependencies not installed. Running setup first...
    call setup.bat
    if %errorlevel% neq 0 (
        pause
        exit /b 1
    )
)

if not exist prisma\dev.db (
    echo Database not found. Setting up database...
    call npx prisma generate
    call npx prisma db push
    call npx prisma db seed
)

echo.
echo Starting development server...
echo Open http://localhost:3000 in your browser
echo.
call npm run dev

