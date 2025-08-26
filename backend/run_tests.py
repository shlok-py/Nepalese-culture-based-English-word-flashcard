#!/usr/bin/env python3
"""
Test runner script for the Nepalese Flashcard API
"""
import subprocess
import sys

def run_tests():
    """Run the test suite"""
    try:
        result = subprocess.run([sys.executable, "-m", "pytest"], check=True)
        print("✅ All tests passed!")
        return True
    except subprocess.CalledProcessError:
        print("❌ Some tests failed!")
        return False

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
