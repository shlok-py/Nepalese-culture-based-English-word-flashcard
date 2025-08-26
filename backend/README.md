# Nepalese Flashcard API

A REST API for Nepalese culture-based English word flashcards, built with FastAPI.

## Project Structure

The application has been refactored into a modular structure for better maintainability and scalability:

```
backend/
├── app/
│   ├── __init__.py
│   ├── app.py              # Main application factory
│   ├── config.py           # Configuration settings
│   ├── models.py           # Pydantic models
│   ├── services.py         # Business logic services
│   ├── middleware.py       # Middleware configuration
│   └── routes/
│       ├── __init__.py
│       ├── health.py       # Health check endpoints
│       ├── words.py        # Word-related endpoints
│       ├── progress.py     # User progress endpoints
│       └── quiz.py         # Quiz generation endpoints
├── data/
│   └── words.json          # Flashcard data
├── tests/
│   ├── __init__.py
│   ├── test_services.py    # Service tests
│   └── test_quiz.py        # Quiz tests
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
└── Dockerfile             # Docker configuration
```

## Features

- **Modular Architecture**: Clean separation of concerns with dedicated modules for models, services, routes, and configuration
- **Dependency Injection**: Uses FastAPI's dependency injection for better testability
- **Type Safety**: Full type hints and Pydantic models for data validation
- **RESTful API**: Well-structured endpoints following REST conventions
- **CORS Support**: Configured for frontend communication
- **Error Handling**: Proper HTTP status codes and error messages
- **Adaptive Quiz System**: Dynamic difficulty adjustment based on user performance

## API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check

### Words
- `GET /api/words` - Get all words
- `GET /api/words/{word_id}` - Get specific word
- `GET /api/words/category/{category}` - Get words by category
- `GET /api/words/difficulty/{difficulty}` - Get words by difficulty

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update user progress
- `POST /api/favorites/{word_id}` - Toggle favorite status
- `GET /api/favorites` - Get favorite words

### Quiz
- `POST /api/quiz/generate` - Generate adaptive quiz question

## Quiz System

The quiz system provides adaptive learning with three difficulty levels:

### Difficulty Levels
- **Beginner**: Basic meaning questions
- **Intermediate**: Cultural significance questions  
- **Advanced**: Sentence completion questions

### Adaptive Logic
- **Correct Answer**: Difficulty increases (beginner → intermediate → advanced)
- **Incorrect Answer**: Difficulty decreases (advanced → intermediate → beginner)

### Quiz Request Format
```json
{
  "previous_answer_correct": true,
  "current_difficulty": "beginner",
  "category": "food"  // optional
}
```

### Quiz Response Format
```json
{
  "id": "unique-quiz-id",
  "question": "What does 'Namaste' mean in Nepali context?",
  "options": ["Hello/Greeting", "Thank you", "Goodbye", "Please"],
  "correct_answer": "Hello/Greeting",
  "explanation": "'Namaste' means 'Hello/Greeting' in Nepali context.",
  "difficulty": "beginner",
  "category": "greetings",
  "word_id": "1"
}
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Ensure you have a `data/words.json` file with your flashcard data

## Running the Application

### Development
```bash
python main.py
```

### Production
```bash
uvicorn app.app:app --host 0.0.0.0 --port 8000
```

### Docker
```bash
docker build -t nepalese-flashcard-api .
docker run -p 8000:8000 nepalese-flashcard-api
```

## Testing

Run the test suite:
```bash
python run_tests.py
# or
pytest
```

## Configuration

Configuration is centralized in `app/config.py`. You can modify:
- API title and version
- CORS allowed origins
- Data file path
- Server host and port

## Data Format

The application expects a JSON file with the following structure:

```json
[
  {
    "id": "unique_id",
    "english": "English word",
    "nepaliContext": "Nepali context",
    "meaning": "Word meaning",
    "example": "Usage example",
    "culturalNote": "Cultural information",
    "image": "image_url",
    "difficulty": "beginner|intermediate|advanced",
    "category": "category_name"
  }
]
```

## Benefits of the Refactored Structure

1. **Separation of Concerns**: Each module has a specific responsibility
2. **Testability**: Services can be easily unit tested
3. **Maintainability**: Code is organized and easy to navigate
4. **Scalability**: Easy to add new features and endpoints
5. **Reusability**: Services can be reused across different routes
6. **Configuration Management**: Centralized configuration
7. **Type Safety**: Better IDE support and error catching
8. **Adaptive Learning**: Dynamic quiz difficulty adjustment
