// API Service - Centralized API calls with error handling and fallback data
import API_CONFIG from '../config/api.js';

class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BACKEND_URL;
    this.isBackendAvailable = null;
  }

  // Check if backend is running
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`, {
        method: 'GET',
        headers: API_CONFIG.getHeaders()
      });
      this.isBackendAvailable = response.ok;
      return response.ok;
    } catch (error) {
      console.error('Backend not available:', error);
      this.isBackendAvailable = false;
      return false;
    }
  }

  // ==================== WORDS/FLASHCARDS ====================
  
  async getWords() {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.WORDS}`, {
        headers: API_CONFIG.getHeaders()
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching words:', error);
      // Return fallback data so app still works
      return this.getFallbackWords();
    }
  }

  async getWordsByCategory(category) {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.WORDS_BY_CATEGORY}/${encodeURIComponent(category)}`,
        { headers: API_CONFIG.getHeaders() }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching words by category:', error);
      return [];
    }
  }

  async getWordsByDifficulty(difficulty) {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.WORDS_BY_DIFFICULTY}/${encodeURIComponent(difficulty)}`,
        { headers: API_CONFIG.getHeaders() }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching words by difficulty:', error);
      return [];
    }
  }

  // ==================== IMAGES ====================
  
  async getImage(filename) {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.IMAGE}/${encodeURIComponent(filename.toLowerCase())}`,
        {
          method: 'POST',
          headers: API_CONFIG.getHeaders()
        }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  }

  // ==================== QUIZ ====================
  
  async generateQuiz(payload) {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.QUIZ_GENERATE}`, {
        method: 'POST',
        headers: API_CONFIG.getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }

  async generateUnderstandQuiz(payload) {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.QUIZ_UNDERSTAND}`, {
        method: 'POST',
        headers: API_CONFIG.getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error generating understand quiz:', error);
      throw error;
    }
  }

  // ==================== FAVORITES ====================
  
  async getFavorites() {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.FAVORITES}`, {
        headers: API_CONFIG.getHeaders()
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return { favorites: [] };
    }
  }

  async addFavorite(wordId) {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.FAVORITES}`, {
        method: 'POST',
        headers: API_CONFIG.getHeaders(),
        body: JSON.stringify({ word_id: wordId })
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding favorite:', error);
      return { success: false };
    }
  }

  async removeFavorite(wordId) {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.FAVORITES}/${wordId}`, {
        method: 'DELETE',
        headers: API_CONFIG.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { success: false };
    }
  }

  // ==================== FALLBACK DATA ====================
  
  getFallbackWords() {
    return [
      {
        id: "1",
        english: "Namaste",
        nepaliContext: "नमस्ते",
        meaning: "A traditional greeting meaning 'I bow to the divine in you'",
        example: "She greeted her teacher with a warm Namaste.",
        culturalNote: "This is the most common greeting in Nepal, used for both hello and goodbye",
        image: "namaste.png",
        difficulty: "beginner",
        category: "greetings"
      },
      {
        id: "2",
        english: "Dashain",
        nepaliContext: "दशैं",
        meaning: "The biggest Hindu festival in Nepal celebrating victory of good over evil",
        example: "Families gather together during Dashain to receive tika and blessings.",
        culturalNote: "Dashain lasts for 15 days and is the most important festival in Nepal",
        image: "dashain.png",
        difficulty: "beginner",
        category: "festivals"
      },
      {
        id: "3",
        english: "Momo",
        nepaliContext: "मोमो",
        meaning: "Traditional Nepali dumplings filled with meat or vegetables",
        example: "We ordered steamed momos with spicy tomato chutney.",
        culturalNote: "Momos are one of the most popular street foods in Nepal",
        image: "momo.png",
        difficulty: "beginner",
        category: "food"
      },
      {
        id: "4",
        english: "Topi",
        nepaliContext: "टोपी",
        meaning: "Traditional Nepali cap worn by men",
        example: "He wore a Dhaka topi for the wedding ceremony.",
        culturalNote: "The Dhaka topi is a symbol of Nepali national identity",
        image: "topi.png",
        difficulty: "beginner",
        category: "clothing"
      },
      {
        id: "5",
        english: "Dhanyabad",
        nepaliContext: "धन्यवाद",
        meaning: "Thank you in Nepali",
        example: "She said dhanyabad after receiving the gift.",
        culturalNote: "Expressing gratitude is an important part of Nepali culture",
        image: "dhanyabad.png",
        difficulty: "beginner",
        category: "greetings"
      },
      {
        id: "6",
        english: "Tihar",
        nepaliContext: "तिहार",
        meaning: "Festival of lights, celebrating the bond between siblings",
        example: "During Tihar, sisters put tika on their brothers' foreheads.",
        culturalNote: "Also known as Deepawali, this festival honors different animals and Laxmi",
        image: "tihar.png",
        difficulty: "beginner",
        category: "festivals"
      },
      {
        id: "7",
        english: "Dal Bhat",
        nepaliContext: "दाल भात",
        meaning: "Traditional Nepali meal of rice and lentil soup",
        example: "Dal bhat is eaten twice a day in most Nepali households.",
        culturalNote: "The saying 'Dal bhat power, 24 hour' reflects its importance",
        image: "dalbhat.png",
        difficulty: "beginner",
        category: "food"
      },
      {
        id: "8",
        english: "Stupa",
        nepaliContext: "स्तूप",
        meaning: "A dome-shaped Buddhist monument",
        example: "Boudhanath Stupa is one of the largest in the world.",
        culturalNote: "Stupas contain relics and are important pilgrimage sites",
        image: "stupa.png",
        difficulty: "intermediate",
        category: "places"
      }
    ];
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default apiService;
