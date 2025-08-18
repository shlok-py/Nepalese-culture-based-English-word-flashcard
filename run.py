#!/usr/bin/env python3
"""
Run script for Nepalese Flashcard Application
Starts both backend and frontend servers
"""

import os
import subprocess
import sys
import threading
import time
import signal

def run_backend():
    """Run the FastAPI backend server"""
    print("🚀 Starting FastAPI backend on http://localhost:5000")
    
    if os.name == 'nt':  # Windows
        python_cmd = "backend\\venv\\Scripts\\python"
    else:  # Unix/Linux/macOS
        python_cmd = "backend/venv/bin/python"
    
    try:
        subprocess.run([python_cmd, "backend/main.py", "--port", "5000"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")
    except FileNotFoundError:
        print("❌ Backend virtual environment not found. Run setup.py first.")

def run_frontend():
    """Run the Next.js frontend server"""
    print("🚀 Starting Next.js frontend on http://localhost:3000")
    
    try:
        subprocess.run([r"C:\Program Files\nodejs\npm.cmd", "run", "dev"], cwd="frontend", check=True)
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")
    except FileNotFoundError:
        print("❌ Node.js or npm not found. Please install Node.js.")

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print("\n🛑 Shutting down servers...")
    sys.exit(0)

def main():
    """Main run function"""
    print("🚀 Starting Nepalese Flashcard Application")
    print("=" * 50)
    
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    # Check if setup has been run
    if not os.path.exists("backend/venv") or not os.path.exists("frontend/node_modules"):
        print("❌ Application not set up. Please run setup.py first.")
        return
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to start
    time.sleep(2)
    
    # Start frontend (this will block)
    try:
        run_frontend()
    except KeyboardInterrupt:
        print("\n🛑 Application stopped")

if __name__ == "__main__":
    main()