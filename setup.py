#!/usr/bin/env python3
"""
Setup script for Nepalese Flashcard Application
"""

import os
import subprocess
import sys

def run_command(command, cwd=None):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, 
                              capture_output=True, text=True)
        print(f"✅ {command}")
        return result
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running: {command}")
        print(f"Error: {e.stderr}")
        return None

def setup_backend():
    """Set up the FastAPI backend"""
    print("\n🔧 Setting up FastAPI Backend...")
    
    # Create virtual environment
    if not os.path.exists("backend/venv"):
        run_command("python -m venv venv", cwd="backend")
    
    # Install dependencies
    if os.name == 'nt':  # Windows
        pip_cmd = "venv\\Scripts\\pip install -r requirements.txt"
    else:  # Unix/Linux/macOS
        pip_cmd = "venv/bin/pip install -r requirements.txt"
    
    run_command(pip_cmd, cwd="backend")

def setup_frontend():
    """Set up the Next.js frontend"""
    print("\n🔧 Setting up Next.js Frontend...")
    
    # Install dependencies
    run_command("npm install", cwd="frontend")

def create_directories():
    """Create necessary directories"""
    print("\n📁 Creating directories...")
    
    directories = [
        "backend",
        "frontend/public/icons",
        "frontend/public/images/cards",
        "data"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created {directory}")

def main():
    """Main setup function"""
    print("🚀 Setting up Nepalese Flashcard Application")
    print("=" * 50)
    
    create_directories()
    setup_backend()
    setup_frontend()
    
    print("\n" + "=" * 50)
    print("✅ Setup complete!")
    print("\nTo run the application:")
    print("1. Start the backend:")
    print("   cd backend")
    if os.name == 'nt':
        print("   venv\\Scripts\\python main.py")
    else:
        print("   venv/bin/python main.py")
    print("\n2. Start the frontend (in another terminal):")
    print("   cd frontend")
    print("   npm run dev")
    print("\n3. Open http://localhost:3000 in your browser")

if __name__ == "__main__":
    main()