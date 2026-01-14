#!/bin/bash
# ====================================================
# Nepal Flashcard App - Single Startup Script
# ====================================================
# This script starts both the backend and frontend servers
# 
# Usage: ./start.sh
# ====================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║       🇳🇵 Nepal Culture Flashcard App Launcher 🇳🇵         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}✓ Servers stopped${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# ==================== CHECK ENVIRONMENT FILES ====================
echo -e "${YELLOW}📋 Checking environment files...${NC}"

# Check backend .env
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}   Creating backend/.env from example...${NC}"
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env" 2>/dev/null || \
    echo -e "FLASK_ENV=development\nPORT=8000\nGEMINI_API_KEY=" > "$BACKEND_DIR/.env"
fi

# Check frontend .env
if [ ! -f "$FRONTEND_DIR/.env" ]; then
    echo -e "${YELLOW}   Creating frontend/.env from example...${NC}"
    cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env" 2>/dev/null || \
    echo "VITE_BACKEND_URL=http://localhost:8000" > "$FRONTEND_DIR/.env"
fi

# Check if GEMINI_API_KEY is set
if grep -q "GEMINI_API_KEY=$" "$BACKEND_DIR/.env" || grep -q "GEMINI_API_KEY=your_gemini" "$BACKEND_DIR/.env"; then
    echo -e "${RED}⚠️  WARNING: GEMINI_API_KEY is not set in backend/.env${NC}"
    echo -e "${YELLOW}   Quiz and Roleplay features will use offline mode.${NC}"
    echo -e "${YELLOW}   Get your key at: https://makersuite.google.com/app/apikey${NC}"
    echo ""
fi

echo -e "${GREEN}✓ Environment files ready${NC}"
echo ""

# ==================== START BACKEND ====================
echo -e "${BLUE}🔧 Starting Backend Server...${NC}"
cd "$BACKEND_DIR"

# Check if venv exists, create if not
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}   Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate venv and install dependencies
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || true

echo -e "${YELLOW}   Installing Python dependencies...${NC}"
pip install -r requirements.txt --quiet 2>/dev/null || pip install -r requirements.txt

echo -e "${YELLOW}   Starting FastAPI server on port 8000...${NC}"
python main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend started successfully
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✓ Backend running at http://localhost:8000${NC}"
else
    echo -e "${RED}✗ Backend failed to start${NC}"
    echo -e "${YELLOW}   Continuing anyway - app will use offline mode${NC}"
fi

echo ""

# ==================== START FRONTEND ====================
echo -e "${BLUE}🎨 Starting Frontend Server...${NC}"
cd "$FRONTEND_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing npm dependencies...${NC}"
    npm install
fi

echo -e "${YELLOW}   Starting Vite dev server on port 5173...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

echo -e "${GREEN}✓ Frontend running at http://localhost:5173${NC}"
echo ""

# ==================== READY ====================
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    🎉 App is Ready! 🎉                    ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║                                                           ║"
echo "║   Frontend:  http://localhost:5173                        ║"
echo "║   Backend:   http://localhost:8000                        ║"
echo "║   API Docs:  http://localhost:8000/docs                   ║"
echo "║                                                           ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║   Press Ctrl+C to stop both servers                       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Keep script running
wait
