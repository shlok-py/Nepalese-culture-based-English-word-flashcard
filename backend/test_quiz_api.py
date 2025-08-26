#!/usr/bin/env python3
"""
Test script to demonstrate the quiz API functionality
"""
import requests
import json

def test_quiz_generation():
    """Test the quiz generation endpoint"""
    base_url = "http://localhost:8000"
    
    # Test 1: Generate beginner quiz (correct answer)
    print("🧪 Test 1: Generating beginner quiz (correct answer)")
    payload = {
        "previous_answer_correct": True,
        "current_difficulty": "beginner"
    }
    
    try:
        response = requests.post(f"{base_url}/api/quiz/generate", json=payload)
        if response.status_code == 200:
            quiz = response.json()
            print(f"✅ Quiz generated successfully!")
            print(f"   Question: {quiz['question']}")
            print(f"   Difficulty: {quiz['difficulty']}")
            print(f"   Category: {quiz['category']}")
            print(f"   Options: {quiz['options']}")
            print(f"   Correct Answer: {quiz['correct_answer']}")
            print()
        else:
            print(f"❌ Failed to generate quiz: {response.status_code}")
            print(f"   Response: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the server is running on localhost:8000")
        return
    
    # Test 2: Generate intermediate quiz (incorrect answer)
    print("🧪 Test 2: Generating intermediate quiz (incorrect answer)")
    payload = {
        "previous_answer_correct": False,
        "current_difficulty": "intermediate"
    }
    
    response = requests.post(f"{base_url}/api/quiz/generate", json=payload)
    if response.status_code == 200:
        quiz = response.json()
        print(f"✅ Quiz generated successfully!")
        print(f"   Question: {quiz['question']}")
        print(f"   Difficulty: {quiz['difficulty']}")
        print(f"   Category: {quiz['category']}")
        print(f"   Options: {quiz['options']}")
        print(f"   Correct Answer: {quiz['correct_answer']}")
        print()
    
    # Test 3: Generate quiz with specific category
    print("🧪 Test 3: Generating quiz with food category")
    payload = {
        "previous_answer_correct": True,
        "current_difficulty": "beginner",
        "category": "food"
    }
    
    response = requests.post(f"{base_url}/api/quiz/generate", json=payload)
    if response.status_code == 200:
        quiz = response.json()
        print(f"✅ Quiz generated successfully!")
        print(f"   Question: {quiz['question']}")
        print(f"   Difficulty: {quiz['difficulty']}")
        print(f"   Category: {quiz['category']}")
        print(f"   Options: {quiz['options']}")
        print(f"   Correct Answer: {quiz['correct_answer']}")
        print()

if __name__ == "__main__":
    print("🚀 Testing Nepalese Flashcard Quiz API")
    print("=" * 50)
    test_quiz_generation()
    print("�� Test completed!")
