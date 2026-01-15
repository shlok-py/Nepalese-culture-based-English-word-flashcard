import json
import random
import uuid
from typing import List, Optional, Tuple
from .models import Word, UserProgress, QuizResponse, QuizRequest, UnderstandQuizResponse
from .config import settings

class WordService:
    """Service for managing word data operations"""
    
    def __init__(self):
        self.words_data: List[dict] = []
        self._load_words()
    
    def _load_words(self) -> None:
        """Load words from JSON file"""
        try:
            with open(settings.DATA_FILE_PATH, "r", encoding="utf-8") as f:
                self.words_data = json.load(f)
        except FileNotFoundError:
            raise ValueError(f"Data file not found: {settings.DATA_FILE_PATH}")
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON format in data file")
    
    def get_all_words(self) -> List[Word]:
        """Get all flashcard words"""
        return [Word(**word) for word in self.words_data]
    
    def get_word_by_id(self, word_id: str) -> Optional[Word]:
        """Get a specific word by ID"""
        word_data = next((w for w in self.words_data if w["id"] == word_id), None)
        return Word(**word_data) if word_data else None
    
    def get_words_by_category(self, category: str) -> List[Word]:
        """Get words filtered by category"""
        filtered_words = [w for w in self.words_data if w["category"] == category]
        return [Word(**word) for word in filtered_words]
    
    def get_words_by_difficulty(self, difficulty: str) -> List[Word]:
        """Get words filtered by difficulty"""
        filtered_words = [w for w in self.words_data if w["difficulty"] == difficulty]
        return [Word(**word) for word in filtered_words]
    
    def get_cultural_context(self, word:str):
        """
        Get a list of tuples containing (word, culturalNote, category) for all words.
        """
        return [w["culturalNote"] for w in self.words_data if w["english"] == word or w["nepaliContext"] == word]
    
    def flag_favourite(self, word):
        """
        Flag a word as favourite by its English or Nepali context name."""
        import os

        favorites_path = settings.FAV_FILE_PATH
        # Load existing favorites
        try:
            with open(favorites_path, "r", encoding="utf-8") as f:
                favorites = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            favorites = []

        # Find the word object
        word_obj = next((w for w in self.words_data if w["english"] == word or w["nepaliContext"] == word), None)
        if not word_obj:
            raise ValueError(f"Word '{word}' not found in data.")

        # Remove any existing entry with the same id
        favorites = [w for w in favorites if w["id"] != word_obj["id"]]

        # Add the word object
        favorites.append(word_obj)

        # Write back to favorites.json
        with open(favorites_path, "a", encoding="utf-8") as f:
            json.dump(favorites, f, ensure_ascii=False, indent=2)
        return word_obj
    
    def get_random_favorite_word(self):
        """Get a random favorite word"""
        # print("hi")
        try:
            with open(settings.FAV_FILE_PATH, "r", encoding="utf-8") as f:
                favorites = json.load(f)
            if not favorites:
                print("none found")
                return None
            random_word = random.choice(favorites)
            return Word(**random_word)
        except (FileNotFoundError, json.JSONDecodeError):
            print("error")
            return None
        
class ProgressService:
    """Service for managing user progress operations"""
    
    def __init__(self):
        self.user_progress = UserProgress()
    
    def get_progress(self) -> UserProgress:
        """Get current user progress"""
        return self.user_progress
    
    def update_progress(self, progress: UserProgress) -> UserProgress:
        """Update user progress"""
        self.user_progress = progress
        return self.user_progress
    
    def toggle_favorite(self, word_id: str) -> dict:
        """Toggle favorite status for a word"""
        if word_id in self.user_progress.favorites:
            self.user_progress.favorites.remove(word_id)
            action = "removed"
        else:
            self.user_progress.favorites.append(word_id)
            action = "added"
        
        return {
            "message": f"Word {action} from favorites",
            "favorites": self.user_progress.favorites
        }
    
    def get_favorite_words(self, word_service: WordService) -> List[Word]:
        """Get all favorite words"""
        favorite_words = [
            word for word in word_service.get_all_words() 
            if word.id in self.user_progress.favorites
        ]
        return favorite_words

import json
from google import genai
from google.genai import types
from typing import Dict, Any, Optional, Tuple
from dataclasses import dataclass
from .fallback_data import get_next_quiz_question, get_next_roleplay_scenario

@dataclass
class QuizInput:
    prev_question: Optional[str] = None
    is_correct: Optional[bool] = None
    right_answer: Optional[str] = None
    given_answer: Optional[str] = None

@dataclass
class QuizOutput:
    question: str
    option_1: str
    option_2: str
    option_3: str
    option_4: str
    right_answer: str

class GeminiQuizService:
    """Service for generating quiz questions using Google Gemini"""
    
    def __init__(self, gemini_api_key: str, word_service: 'WordService'):
        # Use the new google-genai SDK
        self.client = genai.Client(api_key=gemini_api_key)
        # Use only models that definitely exist in the new SDK
        self.model_names = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
        self.current_model_index = 0
        self.word_service = word_service
    
    @property
    def model_name(self):
        return self.model_names[self.current_model_index % len(self.model_names)]
    
    def _try_next_model(self):
        self.current_model_index += 1
        print(f"Switching to model: {self.model_name}")
    
    def _determine_difficulty_adjustment(self, is_correct: Optional[bool]) -> str:
        """Determine difficulty adjustment instruction based on previous answer"""
        if is_correct is None:
            return "easy difficulty"
        elif is_correct:
            return "increase difficulty slightly"
        else:
            return "decrease difficulty or maintain current level"
    
    def _build_context_prompt(self, quiz_request: QuizRequest) -> str:
        """Build context from previous quiz attempt"""
        if not quiz_request.prev_question:
            return "This is the first question in the quiz session."
        
        context = f"Previous question: {quiz_request.prev_question}\n"
        context += f"User answered: {quiz_request.given_answer}\n"
        context += f"Correct answer was: {quiz_request.right_answer}\n"
        context += f"User was {'correct' if quiz_request.is_correct else 'incorrect'}\n"
        
        return context
    
    def _get_words_sample(self, category: Optional[str] = None) -> str:
        """Get a sample of words to provide context to Gemini"""
        try:
            if category:
                words = self.word_service.get_words_by_category(category)
            else:
                words = self.word_service.get_all_words()
            
            # Get a sample of words for context (limit to avoid token limits)
            sample_words = words[:10] if len(words) > 10 else words
            
            words_context = "Available words and their details:\n"
            for word in sample_words:
                words_context += f"- {word.english}: {word.meaning}"
                if hasattr(word, 'culturalNote') and word.culturalNote:
                    words_context += f" (Cultural note: {word.culturalNote})"
                if hasattr(word, 'example') and word.example:
                    words_context += f" (Example: {word.example})"
                words_context += "\n"
            
            return words_context
        except Exception:
            return "Sample words not available."
    
    def _extract_response_text(self, response) -> str:
        """Safely extract text from Gemini response"""
        try:
            # Method 1: Try simple text access
            if hasattr(response, 'text') and response.text:
                return response.text.strip()
        except Exception:
            pass
        
        try:
            # Method 2: Access through parts
            if hasattr(response, 'parts') and response.parts:
                return response.parts[0].text.strip()
        except Exception:
            pass
        
        try:
            # Method 3: Full candidates lookup
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate, 'content') and candidate.content:
                    if hasattr(candidate.content, 'parts') and candidate.content.parts:
                        return candidate.content.parts[0].text.strip()
        except Exception:
            pass
        
        # Method 4: Direct string conversion as fallback
        try:
            return str(response).strip()
        except Exception:
            raise ValueError("Could not extract text from Gemini response")
    
    def _validate_quiz_response(self, quiz_data: Dict[str, Any]) -> tuple[bool, Optional[QuizResponse], str]:
        """
        Validate quiz response using QuizResponse model
        Returns: (is_valid, quiz_response, error_message)
        """
        try:
            # Check if quiz_data is actually a dict
            if not isinstance(quiz_data, dict):
                return False, None, f"Response is not a dictionary: {type(quiz_data)}"
            
            # Check if all required keys are present
            required_keys = ["question", "1", "2", "3", "4", "right_answer"]
            missing_keys = [key for key in required_keys if key not in quiz_data]
            if missing_keys:
                return False, None, f"Missing required keys: {missing_keys}. Available keys: {list(quiz_data.keys())}"
            
            # Check for empty values
            empty_keys = [key for key in required_keys if not quiz_data.get(key) or str(quiz_data.get(key)).strip() == ""]
            if empty_keys:
                return False, None, f"Empty values found for keys: {empty_keys}"
            
            # Try to create QuizResponse object
            quiz_response = QuizResponse(**quiz_data)
            
            # Additional validation: check if right_answer matches one of the options
            options = [str(quiz_data["1"]).strip(), str(quiz_data["2"]).strip(), 
                      str(quiz_data["3"]).strip(), str(quiz_data["4"]).strip()]
            right_answer = str(quiz_response.right_answer).strip()
            
            if right_answer not in options:
                return False, None, f"right_answer '{right_answer}' does not match any of the provided options: {options}"
            
            return True, quiz_response, ""
            
        except Exception as e:
            return False, None, f"Validation error: {str(e)}"
    
    def _generate_critique_prompt(self, original_response: str, error_message: str) -> str:
        """Generate a critique prompt to fix the response"""
        return f"""The previous response had validation errors. Here's what went wrong:

ERROR: {error_message}

ORIGINAL RESPONSE: {original_response}

Please fix the response to ensure:
1. It's valid JSON format
2. Contains exactly these keys: "question", "1", "2", "3", "4", "right_answer"
3. The "right_answer" field contains the EXACT same text as one of the options "1", "2", "3", or "4"
4. All values are non-empty strings
5. The question is about Nepali language/culture
6. Use ENGLISH language for all content, not Nepali script

Return ONLY the corrected JSON object with the exact format:
{{
    "question": "Your question here",
    "1": "First option",
    "2": "Second option",
    "3": "Third option",
    "4": "Fourth option",
    "right_answer": "The exact text of the correct option"
}}"""

    def generate_quiz(self, quiz_request: QuizRequest) -> Dict[str, Any]:
        """Generate a quiz question using Gemini with validation and critique system"""
        import random
        import time
        
        # Build context and difficulty adjustment
        context = self._build_context_prompt(quiz_request)
        difficulty_instruction = self._determine_difficulty_adjustment(quiz_request.is_correct)
        words_context = self._get_words_sample(quiz_request.category)
        
        # Add randomization to ensure variety
        question_types = [
            "word meaning (English to Nepali translation)",
            "word meaning (Nepali to English translation)", 
            "cultural practice or tradition",
            "festival or celebration",
            "food and cuisine",
            "greeting or polite expression",
            "family relationship terms",
            "common phrases used in daily life"
        ]
        random_type = random.choice(question_types)
        random_seed = int(time.time() * 1000) % 10000
        
        # Construct the initial prompt
        initial_prompt = f"""You are creating a Nepali language and culture quiz question.
        
IMPORTANT: Generate a UNIQUE question. Random seed: {random_seed}
Focus on this topic type: {random_type}

{context}

Based on the user's previous performance, {difficulty_instruction}.

{words_context}

Create a multiple-choice question about Nepali language, culture, or vocabulary. The question should be educational and help users learn about Nepal.

Write the question and options primarily in ENGLISH so learners can understand. You may include Nepali words/script in parentheses where helpful.

Requirements:
1. Generate exactly 4 options
2. Make sure one option is clearly correct
3. Make the other 3 options plausible but incorrect
4. GENERATE A DIFFERENT QUESTION EACH TIME - do not repeat previous questions
5. Question types can include:
   - Word meanings (English to Nepali or Nepali to English)
   - Cultural significance
   - Usage in context
   - Fill in the blanks
   - Cultural practices
   - Nepali script recognition

Return your response as a valid JSON object with this exact format:
{{
    "question": "Your question here (primarily in English)",
    "1": "First option", 
    "2": "Second option",
    "3": "Third option",
    "4": "Fourth option",
    "right_answer": "The exact text of the correct option"
}}

CRITICAL: Make sure the "right_answer" field contains the EXACT same text as one of the numbered options (1, 2, 3, or 4).
The JSON structure must be valid and complete with all 6 fields."""

        max_attempts = 3
        
        for attempt in range(max_attempts):
            try:
                # Prepare the prompt for this attempt
                if attempt == 0:
                    current_prompt = initial_prompt
                else:
                    # Use critique prompt for retries
                    current_prompt = self._current_critique_prompt
                
                # Make API call to Gemini using new SDK
                try:
                    response = self.client.models.generate_content(
                        model=self.model_name,
                        contents=current_prompt,
                        config=types.GenerateContentConfig(
                            temperature=0.7 if attempt == 0 else 0.3,
                            max_output_tokens=500,
                        )
                    )
                except Exception as model_error:
                    if "429" in str(model_error) or "RESOURCE_EXHAUSTED" in str(model_error):
                        self._try_next_model()  # Try next model
                        raise model_error  # Will be caught by outer except
                    raise
                
                # Extract response text safely
                try:
                    response_text = self._extract_response_text(response)
                except ValueError as e:
                    if attempt < max_attempts - 1:
                        print(f"Attempt {attempt + 1} failed to extract response: {str(e)}. Retrying...")
                        self._current_critique_prompt = "Please generate a valid Nepali language quiz question in JSON format. You can use both English and Nepali Devanagari script as appropriate."
                        continue
                    else:
                        print(f"Failed to extract response after {max_attempts} attempts")
                        return self._generate_fallback_quiz()
                
                # Clean up response if it has markdown code blocks
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3].strip()
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3].strip()
                
                # Try to parse JSON
                try:
                    quiz_data = json.loads(response_text)
                except json.JSONDecodeError as json_error:
                    if attempt < max_attempts - 1:
                        # Add critique for JSON parsing error
                        critique_prompt = self._generate_critique_prompt(response_text, f"Invalid JSON format: {str(json_error)}")
                        self._current_critique_prompt = critique_prompt
                        print(f"Attempt {attempt + 1} failed JSON parsing: {str(json_error)}. Retrying...")
                        continue
                    else:
                        print(f"JSON parsing failed after {max_attempts} attempts")
                        return self._generate_fallback_quiz()
                
                # Validate the response using QuizResponse model
                is_valid, validated_response, error_message = self._validate_quiz_response(quiz_data)
                
                if is_valid:
                    print(f"Quiz generated successfully on attempt {attempt + 1}")
                    return quiz_data
                else:
                    if attempt < max_attempts - 1:
                        # Add critique for validation error
                        critique_prompt = self._generate_critique_prompt(response_text, error_message)
                        self._current_critique_prompt = critique_prompt
                        print(f"Attempt {attempt + 1} failed validation: {error_message}. Retrying...")
                    else:
                        print(f"Validation failed after {max_attempts} attempts: {error_message}")
                        return self._generate_fallback_quiz()
                
            except Exception as e:
                if attempt < max_attempts - 1:
                    print(f"Attempt {attempt + 1} failed with error: {str(e)}. Retrying...")
                    # Add a generic critique for API errors
                    self._current_critique_prompt = "There was an error with the previous response. Please generate a valid Nepali language quiz question in the exact JSON format specified. You can use both English and Nepali Devanagari script as appropriate."
                else:
                    print(f"All attempts failed. Error: {str(e)}")
                    return self._generate_fallback_quiz()
        
        # If we reach here, all attempts failed
        return self._generate_fallback_quiz()
    
    def _generate_fallback_quiz(self) -> Dict[str, Any]:
        """Generate a fallback quiz question from the rich question bank"""
        return get_next_quiz_question()
    
    def generate_understand_quiz(self, quiz_request: QuizRequest) -> Dict[str, Any]:
        """Generate an understanding quiz question"""
        
        import random
        words = self.word_service.get_all_words()
        random_word = random.choice(words) if words else None
        explanation = self.word_service.get_cultural_context(random_word.english) if random_word else "No cultural context available."
        word = random_word.english if random_word else "Namaste"
        category = random_word.category if random_word else "greetings"
        
        
        prompt = f"""You are creating a cultural roleplay scenario about Nepali culture for English-speaking learners.

IMPORTANT: Write ALL content in ENGLISH. You may include Nepali words in parentheses for key terms.

Return the response strictly in JSON format following this schema:
{{
    "context": "<string describing a cultural scenario in Nepal>",
    "question": "<string asking what the appropriate response/action is>",
    "1": "<first option>",
    "2": "<second option>", 
    "3": "<third option>",
    "4": "<fourth option>",
    "right_answer": "<the number 1, 2, 3, or 4 of the correct option>"
}}

Where:
- "context": A realistic cultural scenario in Nepal (written in ENGLISH), such as visiting a temple, attending a festival, shopping at a bazaar, dining at a Nepali home, etc.
- "question": Ask what the culturally appropriate action or response would be.
- "1", "2", "3", "4": Four possible answers - one correct and culturally appropriate, others are common mistakes foreigners might make.
- "right_answer": The number ("1", "2", "3", or "4") of the correct option.

For the word "{word}", which means {explanation}, and belongs to {category} category, create an engaging roleplay scenario.

Example Output:
{{
    "context": "You are visiting a Nepali friend's home for dinner. The host offers you a second helping of dal bhat (lentil soup with rice).",
    "question": "What is the polite way to accept the food?",
    "1": "Grab the bowl yourself and serve more",
    "2": "Say 'Dhanyabad' (thank you) and accept graciously with both hands",
    "3": "Refuse loudly and push the plate away",
    "4": "Leave the table without saying anything",
    "right_answer": "2"
}}

Generate a DIFFERENT scenario each time - do not repeat the same question!"""
        max_attempts = 3

        for attempt in range(max_attempts):
            try:
                current_prompt = prompt if attempt == 0 else self._current_critique_prompt

                # Make API call to Gemini using new SDK
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=current_prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.7 if attempt == 0 else 0.3,
                        max_output_tokens=500,
                    )
                )

                try:
                    response_text = self._extract_understand_response_text(response)
                except ValueError as e:
                    if attempt < max_attempts - 1:
                        self._current_critique_prompt = (
                            "Previous output was empty or unreadable.\n"
                            + self._schema_understand_prompt()
                            + "\nRegenerate now."
                        )
                        continue
                    return self._generate_understand_fallback_quiz(word)

                # Strip code fences if present
                response_text = self._strip_fences(response_text)

                # Parse JSON
                try:
                    quiz_data = json.loads(response_text)
                except json.JSONDecodeError as json_error:
                    if attempt < max_attempts - 1:
                        self._current_critique_prompt = self._generate_understand_critique_prompt(
                            raw_text=response_text,
                            error_msg=f"Invalid JSON: {json_error}"
                        )
                        continue
                    return self._generate_understand_fallback_quiz(word)

                # Validate against Pydantic
                is_valid, _, error_message = self._validate_understand_quiz_response(quiz_data)
                if is_valid:
                    return quiz_data

                # Not valid -> try again with critique
                if attempt < max_attempts - 1:
                    self._current_critique_prompt = self._generate_understand_critique_prompt(
                        raw_text=response_text,
                        error_msg=error_message
                    )
                    continue
                else:
                    return self._generate_understand_fallback_quiz(word)

            except Exception as e:
                if attempt < max_attempts - 1:
                    self._current_critique_prompt = (
                        f"API error occurred: {e}\n"
                        + self._schema_understand_prompt()
                        + "\nRegenerate now."
                    )
                    continue
                return self._generate_understand_fallback_quiz(word)

        return self._generate_understand_fallback_quiz(word)
    
    def _extract_understand_response_text(self, response) -> str:
        # Handles typical Gemini SDK response shapes
        # Prefer response.text; fallback to candidate parts if needed
        if hasattr(response, "text") and response.text:
            return response.text.strip()

        # Fallback: collect all text parts
        try:
            parts = []
            for cand in getattr(response, "candidates", []) or []:
                for part in getattr(cand, "content", {}).get("parts", []):
                    t = getattr(part, "text", None) or part.get("text")  # dict fallback
                    if t:
                        parts.append(t)
            combined = "\n".join(parts).strip()
            if not combined:
                raise ValueError("No text found in response candidates.")
            return combined
        except Exception as e:
            raise ValueError(f"Could not extract response text: {e}")

    def _strip_fences(self, s: str) -> str:
        s = s.strip()
        if s.startswith("```json") and s.endswith("```"):
            return s[7:-3].strip()
        if s.startswith("```") and s.endswith("```"):
            return s[3:-3].strip()
        return s

    def _validate_understand_quiz_response(self, data: dict) -> Tuple[bool, Optional[UnderstandQuizResponse], str]:
        # Must include correct keys and valid right_answer
        missing = [k for k in ["context", "question", "1", "2", "3", "4", "right_answer"] if k not in data]
        if missing:
            return False, None, f"Missing keys: {', '.join(missing)}"

        if data.get("right_answer") not in {"1", "2", "3", "4"}:
            return False, None, "right_answer must be one of '1','2','3','4'."

        try:
            # Validate; aliases map "1","2","3","4" to fields
            validated = UnderstandQuizResponse.model_validate(data)
            # Non-empty basic checks
            if not all([validated.context.strip(), validated.question.strip(),
                        validated.option_1.strip(), validated.option_2.strip(),
                        validated.option_3.strip(), validated.option_4.strip()]):
                return False, None, "Fields must be non-empty strings."
            return True, validated, ""
        except ValidationError as ve:
            return False, None, f"Pydantic validation error: {ve}"

    def _generate_understand_critique_prompt(self, raw_text: str, error_msg: str) -> str:
        return (
            "The previous output had issues:\n"
            f"- {error_msg}\n\n"
            "Here is the previous output (verbatim):\n"
            f"{raw_text}\n\n"
            "Please regenerate strictly as raw JSON with NO code fences and NO extra commentary.\n"
            + self._schema_understand_prompt()
            + "\nWrite ALL content in ENGLISH. Ensure cultural scenarios are authentic."
        )
    def _schema_understand_prompt(self) -> str:
        return """
        Output JSON schema:
        {
        "context": "<string - cultural scenario in ENGLISH>",
        "question": "<string - question in ENGLISH>",
        "1": "<string - first option>",
        "2": "<string - second option>",
        "3": "<string - third option>",
        "4": "<string - fourth option>",
        "right_answer": "<string - '1', '2', '3', or '4'>"
        }
        """.strip()

    def _generate_understand_fallback_quiz(self, word: str) -> dict:
        """Generate a rich fallback roleplay scenario from the scenario bank"""
        return get_next_roleplay_scenario()

    # # Usage example:
    # def example_usage():
    #     # Initialize the service
    #     quiz_service = GeminiQuizService(
    #         gemini_api_key="your-gemini-api-key",
    #         word_service=word_service_instance  # Your existing WordService
    #     )
        
    #     # First question (no previous context)
    #     first_input = QuizInput()
    #     first_quiz = quiz_service.generate_quiz(first_input)
    #     print("First quiz:", first_quiz)
        
    #     # Subsequent question (with previous context)
    #     subsequent_input = QuizInput(
    #         prev_question="What is the traditional greeting in Nepal?",
    #         is_correct=True,
    #         right_answer="Namaste",
    #         given_answer="Namaste"
    #     )
    #     subsequent_quiz = quiz_service.generate_quiz(subsequent_input, category="greetings")
    #     print("Subsequent quiz:", subsequent_quiz)

    # Alternative class with simpler interface matching your exact input format
#     class SimpleQuizService:
#         """Simplified version that directly matches your input/output format"""
        
#         def __init__(self, gemini_api_key: str):
#             genai.configure(api_key=gemini_api_key)
#             self.model = genai.GenerativeModel('gemini-pro')
        
#         def generate_quiz(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
#             """
#             Generate quiz with exact input/output format as specified
            
#             Input format:
#             {
#                 "Prev question": "...",
#                 "is_correct": true/false,
#                 "right_answer": "...",
#                 "given_answer": "..."
#             }
            
#             Output format:
#             {
#                 "question": "...",
#                 "1": "...",
#                 "2": "...",
#                 "3": "...", 
#                 "4": "...",
#                 "right_answer": "..."
#             }
#             """
        
#         # Extract input data
#         prev_question = input_data.get("Prev question")
#         is_correct = input_data.get("is_correct")
#         right_answer = input_data.get("right_answer")
#         given_answer = input_data.get("given_answer")
        
#         # Build context
#         if prev_question:
#             context = f"Previous question: {prev_question}\n"
#             context += f"User answered: {given_answer}\n"
#             context += f"Correct answer was: {right_answer}\n"
#             context += f"User was {'correct' if is_correct else 'incorrect'}\n"
            
#             if is_correct:
#                 difficulty_instruction = "make the next question slightly more challenging"
#             else:
#                 difficulty_instruction = "make the next question easier or maintain difficulty"
#         else:
#             context = "This is the first question."
#             difficulty_instruction = "use medium difficulty"
        
#         prompt = f"""{context}

# Based on the context above, {difficulty_instruction}.

# Create a multiple-choice question about Nepali language, culture, or vocabulary.

# Return ONLY a valid JSON object with this exact format:
# {{
#     "question": "Your question here",
#     "1": "First option",
#     "2": "Second option",
#     "3": "Third option", 
#     "4": "Fourth option",
#     "right_answer": "The exact text of the correct option"
# }}"""

#         try:
#             system_instruction = "You are a Nepali language and culture expert. Respond only with valid JSON."
#             full_prompt = f"{system_instruction}\n\n{prompt}"
            
#             response = self.model.generate_content(
#                 full_prompt,
#                 generation_config=genai.types.GenerationConfig(
#                     temperature=0.7,
#                     max_output_tokens=400,
#                 )
#             )
            
#             response_text = response.text.strip()
            
#             # Clean JSON response
#             if response_text.startswith('```json'):
#                 response_text = response_text[7:-3].strip()
#             elif response_text.startswith('```'):
#                 response_text = response_text[3:-3].strip()
            
#             return json.loads(response_text)
            
#         except Exception as e:
#             print(f"Error: {e}")
#             return {
#                 "question": "What does 'Dhanyabad' mean in English?",
#                 "1": "Thank you",
#                 "2": "Hello",
#                 "3": "Goodbye", 
#                 "4": "Please",
#                 "right_answer": "Thank you"
#             }