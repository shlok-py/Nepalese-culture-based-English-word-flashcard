// Centralized API configuration
// This file manages all API endpoints and configuration

const API_CONFIG = {
  // Backend API URL - uses environment variable or falls back to localhost
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  
  // Gemini API Key (for frontend features that need it directly)
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  
  // API Endpoints
  ENDPOINTS: {
    // Words/Flashcards
    WORDS: '/api/words',
    WORDS_BY_CATEGORY: '/api/words/category',
    WORDS_BY_DIFFICULTY: '/api/words/difficulty',
    
    // Quiz
    QUIZ_GENERATE: '/api/quiz/generate',
    QUIZ_UNDERSTAND: '/api/quiz/generate_understand_quiz',
    
    // Images
    IMAGE: '/api/image',
    IMAGES: '/api/images',
    
    // Progress & Favorites
    FAVORITES: '/api/progress/favorites',
    PROGRESS: '/api/progress',
    
    // Health check
    HEALTH: '/api/health'
  },

  // Request headers for ngrok (if using ngrok tunnel)
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  })
};

// Validate configuration on startup
export const validateConfig = () => {
  const warnings = [];
  
  console.log('🔧 API Configuration:');
  console.log(`   Backend URL: ${API_CONFIG.BACKEND_URL}`);
  
  if (!API_CONFIG.GEMINI_API_KEY) {
    warnings.push('GEMINI_API_KEY not set - Quiz and Roleplay features may not work');
    console.warn('⚠️ GEMINI_API_KEY not set in frontend');
  }
  
  return warnings;
};

// Check if backend is available
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BACKEND_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      headers: API_CONFIG.getHeaders()
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export default API_CONFIG;
