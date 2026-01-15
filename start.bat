@echo off
setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║       🇳🇵 Nepal Culture Flashcard App Launcher 🇳🇵         ║
echo ║                   Windows Edition                         ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: Check if this is first time setup
set FIRST_RUN=0
if not exist "backend\venv" set FIRST_RUN=1
if not exist "frontend\node_modules" set FIRST_RUN=1

if %FIRST_RUN%==1 (
    echo 📋 First time setup detected. Running full installation...
    echo.
    goto :FULL_SETUP
) else (
    echo ✓ Previous installation detected. Starting servers...
    echo.
    goto :START_SERVERS
)

:FULL_SETUP
echo ═══════════════════════════════════════════════════════════
echo                    FIRST TIME SETUP
echo ═══════════════════════════════════════════════════════════
echo.

:: Check Python installation
echo [1/6] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Python not found! Please install Python 3.10+ from https://python.org
    echo   Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✓ Python %PYTHON_VERSION% found

:: Check Node.js installation
echo [2/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js not found! Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=1" %%i in ('node --version 2^>^&1') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% found

:: Setup Python virtual environment
echo [3/6] Setting up Python virtual environment...
cd backend
if not exist "venv" (
    python -m venv venv
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

:: Activate venv and install dependencies
echo [4/6] Installing Python dependencies...
call venv\Scripts\activate.bat
pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt
if errorlevel 1 (
    echo ✗ Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Python dependencies installed
cd ..

:: Setup environment files
echo [5/6] Setting up environment files...
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo ✓ Backend .env created from example
    ) else (
        (
            echo # Nepal Culture Flashcard App - Backend Environment
            echo SECRET_KEY=nepal-culture-app-secret-key-change-in-production
            echo DEBUG=true
            echo GEMINI_API_KEY=
        ) > "backend\.env"
        echo ✓ Backend .env created with defaults
    )
) else (
    echo ✓ Backend .env already exists
)

if not exist "frontend\.env" (
    if exist "frontend\.env.example" (
        copy "frontend\.env.example" "frontend\.env" >nul
        echo ✓ Frontend .env created from example
    ) else (
        (
            echo # Nepal Culture Flashcard App - Frontend Environment
            echo VITE_API_URL=http://localhost:8000
        ) > "frontend\.env"
        echo ✓ Frontend .env created with defaults
    )
) else (
    echo ✓ Frontend .env already exists
)

:: Install frontend dependencies
echo [6/6] Installing frontend dependencies...
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
echo ═══════════════════════════════════════════════════════════
echo                 SETUP COMPLETE! ✓
echo ═══════════════════════════════════════════════════════════
echo.

:START_SERVERS
echo 🔧 Starting Backend Server...
cd backend
call venv\Scripts\activate.bat

:: Start backend in new window
start "Nepal Culture - Backend" cmd /k "venv\Scripts\activate.bat && python -m uvicorn app.app:app --reload --host 0.0.0.0 --port 8000"
cd ..

:: Wait for backend to initialize
echo    Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend Server...
cd frontend
start "Nepal Culture - Frontend" cmd /k "npm run dev"
cd ..

:: Wait for frontend to initialize
timeout /t 3 /nobreak >nul

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                    🎉 App is Ready! 🎉                    ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║                                                           ║
echo ║   Frontend:  http://localhost:5173                        ║
echo ║   Backend:   http://localhost:8000                        ║
echo ║   API Docs:  http://localhost:8000/docs                   ║
echo ║                                                           ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║   Close the terminal windows to stop the servers          ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: Open browser
echo Opening application in browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo Press any key to exit this launcher (servers will keep running)...
pause >nul
exit /b 0
