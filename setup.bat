@echo off
setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║       🇳🇵 Nepal Culture Flashcard App - Setup Only 🇳🇵     ║
echo ║                   Windows Edition                         ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

echo This script will set up the development environment without starting servers.
echo.

:: Check Python installation
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Python not found!
    echo.
    echo Please install Python 3.10+ from https://python.org
    echo IMPORTANT: Check "Add Python to PATH" during installation!
    echo.
    pause
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✓ Python %PYTHON_VERSION% found

:: Check Node.js installation
echo [2/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js not found!
    echo.
    echo Please install Node.js 18+ from https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f "tokens=1" %%i in ('node --version 2^>^&1') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% found

:: Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ npm not found! It should come with Node.js installation.
    pause
    exit /b 1
)
for /f "tokens=1" %%i in ('npm --version 2^>^&1') do set NPM_VERSION=%%i
echo ✓ npm %NPM_VERSION% found

:: Setup Python virtual environment
echo [3/5] Setting up Python virtual environment...
cd backend
if exist "venv" (
    echo    Removing old virtual environment...
    rmdir /s /q venv
)
python -m venv venv
if errorlevel 1 (
    echo ✗ Failed to create virtual environment
    pause
    exit /b 1
)
echo ✓ Virtual environment created

:: Activate venv and install dependencies
echo [4/5] Installing Python dependencies...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo ✗ Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Python dependencies installed
call deactivate
cd ..

:: Setup environment files
echo [5/5] Setting up environment and frontend...

:: Backend .env
if not exist "backend\.env" (
    (
        echo # Nepal Culture Flashcard App - Backend Environment
        echo SECRET_KEY=nepal-culture-app-secret-key-change-in-production
        echo DEBUG=true
        echo GEMINI_API_KEY=
    ) > "backend\.env"
    echo ✓ Backend .env created
) else (
    echo ✓ Backend .env already exists
)

:: Frontend .env
if not exist "frontend\.env" (
    (
        echo # Nepal Culture Flashcard App - Frontend Environment
        echo VITE_API_URL=http://localhost:8000
    ) > "frontend\.env"
    echo ✓ Frontend .env created
) else (
    echo ✓ Frontend .env already exists
)

:: Install frontend dependencies
echo    Installing frontend dependencies (this may take a few minutes)...
cd frontend
call npm install
if errorlevel 1 (
    echo ✗ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
cd ..

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║              🎉 SETUP COMPLETE! 🎉                        ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║                                                           ║
echo ║   To start the application, run:                          ║
echo ║                                                           ║
echo ║       start.bat                                           ║
echo ║                                                           ║
echo ║   Or manually:                                            ║
echo ║                                                           ║
echo ║   Backend:                                                ║
echo ║     cd backend                                            ║
echo ║     venv\Scripts\activate                                 ║
echo ║     uvicorn app.app:app --reload --port 8000              ║
echo ║                                                           ║
echo ║   Frontend:                                               ║
echo ║     cd frontend                                           ║
echo ║     npm run dev                                           ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
pause
exit /b 0
