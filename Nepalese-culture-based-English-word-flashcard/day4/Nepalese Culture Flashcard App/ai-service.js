// AI Service for adaptive learning and analytics
class AIService {
  constructor() {
    this.userData = {
      userId: null,
      childName: '',
      startDate: new Date(),
      totalSessions: 0,
      totalWordsLearned: 0,
      currentStreak: 0,
      lastSessionDate: null,
      categoryProgress: {},
      performanceHistory: [],
      badges: [],
      preferences: {
        difficulty: 'medium',
        learningSpeed: 'normal'
      }
    };
    
    this.sessionData = {
      currentSession: null,
      wordsAttempted: [],
      correctAnswers: 0,
      totalAnswers: 0,
      sessionStartTime: null,
      categoryScores: {}
    };
    
    this.loadUserData();
  }

  // Initialize user profile
  initializeUser(userId, childName) {
    this.userData.userId = userId;
    this.userData.childName = childName;
    
    // Initialize category progress
    Object.keys(vocabularyData).forEach(categoryId => {
      if (!this.userData.categoryProgress[categoryId]) {
        this.userData.categoryProgress[categoryId] = {
          wordsLearned: 0,
          totalWords: vocabularyData[categoryId].words.length,
          accuracy: 0,
          lastAccessed: null,
          difficulty: 1,
          completed: false
        };
      }
    });
    
    this.saveUserData();
    return this.getAnalyticsReport();
  }

  // Start a new learning session
  startSession(categoryId = null) {
    this.sessionData.currentSession = {
      sessionId: Date.now(),
      categoryId: categoryId,
      startTime: new Date(),
      wordsAttempted: [],
      correctAnswers: 0,
      totalAnswers: 0
    };
    
    this.sessionData.sessionStartTime = Date.now();
    this.userData.totalSessions++;
    
    // Update streak
    this.updateStreak();
    
    return this.sessionData.currentSession;
  }

  // Record word attempt
  recordWordAttempt(wordId, categoryId, isCorrect, timeSpent = 0) {
    if (!this.sessionData.currentSession) {
      this.startSession(categoryId);
    }

    const attempt = {
      wordId,
      categoryId,
      isCorrect,
      timeSpent,
      timestamp: Date.now(),
      difficulty: this.getDifficultyForWord(wordId, categoryId)
    };

    this.sessionData.wordsAttempted.push(attempt);
    this.sessionData.totalAnswers++;
    
    if (isCorrect) {
      this.sessionData.correctAnswers++;
      this.markWordAsLearned(wordId, categoryId);
    }

    // Update category progress
    if (!this.userData.categoryProgress[categoryId]) {
      this.userData.categoryProgress[categoryId] = {
        wordsLearned: 0,
        totalWords: vocabularyData[categoryId].words.length,
        accuracy: 0,
        lastAccessed: new Date(),
        difficulty: 1,
        completed: false
      };
    }

    const categoryProgress = this.userData.categoryProgress[categoryId];
    categoryProgress.lastAccessed = new Date();
    
    // Calculate accuracy for this category
    const categoryAttempts = this.sessionData.wordsAttempted.filter(a => a.categoryId === categoryId);
    const categoryCorrect = categoryAttempts.filter(a => a.isCorrect).length;
    categoryProgress.accuracy = categoryAttempts.length > 0 ? (categoryCorrect / categoryAttempts.length) * 100 : 0;

    // Adjust difficulty based on performance
    this.adjustDifficulty(categoryId, isCorrect);
    
    this.saveUserData();
    return attempt;
  }

  // Mark word as learned
  markWordAsLearned(wordId, categoryId) {
    const categoryProgress = this.userData.categoryProgress[categoryId];
    if (categoryProgress) {
      categoryProgress.wordsLearned++;
      this.userData.totalWordsLearned++;
      
      // Check if category is completed
      if (categoryProgress.wordsLearned >= categoryProgress.totalWords) {
        categoryProgress.completed = true;
        this.awardBadge(`${categoryId}-badge`);
      }
    }
  }

  // Get difficulty for a specific word
  getDifficultyForWord(wordId, categoryId) {
    const word = vocabularyData[categoryId]?.words.find(w => w.id === wordId);
    return word ? word.difficulty : 1;
  }

  // Adjust difficulty based on performance
  adjustDifficulty(categoryId, wasCorrect) {
    const categoryProgress = this.userData.categoryProgress[categoryId];
    if (!categoryProgress) return;

    if (wasCorrect) {
      // Increase difficulty if performing well
      if (categoryProgress.accuracy > 80 && categoryProgress.difficulty < 3) {
        categoryProgress.difficulty += 0.1;
      }
    } else {
      // Decrease difficulty if struggling
      if (categoryProgress.accuracy < 60 && categoryProgress.difficulty > 1) {
        categoryProgress.difficulty -= 0.1;
      }
    }
    
    // Keep difficulty in bounds
    categoryProgress.difficulty = Math.max(1, Math.min(3, categoryProgress.difficulty));
  }

  // Generate next words to learn based on adaptive algorithm
  getNextWords(categoryId, count = 5) {
    if (!vocabularyData[categoryId]) return [];
    
    const categoryProgress = this.userData.categoryProgress[categoryId];
    const allWords = vocabularyData[categoryId].words;
    
    // Filter words by difficulty and learning progress
    const targetDifficulty = categoryProgress ? Math.floor(categoryProgress.difficulty) : 1;
    
    let availableWords = allWords.filter(word => {
      return word.difficulty <= targetDifficulty + 1; // Allow slightly higher difficulty
    });
    
    // If not enough words, include all words
    if (availableWords.length < count) {
      availableWords = allWords;
    }
    
    // Shuffle and return
    return this.shuffleArray(availableWords).slice(0, count);
  }

  // Generate personalized feedback
  generatePersonalizedFeedback(accuracy, categoryId, childName) {
    const feedbackTemplates = {
      excellent: [
        `Outstanding work, ${childName}! You're becoming a real Nepali language expert! 🌟`,
        `Fantastic job, ${childName}! Your pronunciation is getting better every day! 🎉`,
        `Amazing progress, ${childName}! You're learning so fast! 🚀`
      ],
      good: [
        `Great effort, ${childName}! You're doing really well with these words! 👏`,
        `Nice work, ${childName}! Keep practicing and you'll be perfect! 💪`,
        `Good job, ${childName}! You're getting better with every try! ⭐`
      ],
      needsWork: [
        `Good try, ${childName}! Remember, practice makes perfect! 🌱`,
        `Keep going, ${childName}! Learning a new language takes time! 🎯`,
        `Don't worry, ${childName}! Every mistake helps you learn better! 💖`
      ]
    };

    let category = 'needsWork';
    if (accuracy >= 80) category = 'excellent';
    else if (accuracy >= 60) category = 'good';
    
    const templates = feedbackTemplates[category];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    return randomTemplate;
  }

  // Award badge
  awardBadge(badgeId) {
    if (!this.userData.badges.includes(badgeId)) {
      this.userData.badges.push(badgeId);
      
      // Special milestone badges
      if (this.userData.totalWordsLearned >= 50 && !this.userData.badges.includes('vocabulary-50')) {
        this.userData.badges.push('vocabulary-50');
      }
      
      if (this.userData.currentStreak >= 7 && !this.userData.badges.includes('streak-7')) {
        this.userData.badges.push('streak-7');
      }
      
      this.saveUserData();
      return true;
    }
    return false;
  }

  // Update learning streak
  updateStreak() {
    const today = new Date().toDateString();
    const lastSession = this.userData.lastSessionDate;
    
    if (lastSession) {
      const lastSessionDate = new Date(lastSession).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastSessionDate === today) {
        // Same day, don't change streak
        return;
      } else if (lastSessionDate === yesterday) {
        // Consecutive day, increase streak
        this.userData.currentStreak++;
      } else {
        // Streak broken, reset
        this.userData.currentStreak = 1;
      }
    } else {
      // First session
      this.userData.currentStreak = 1;
    }
    
    this.userData.lastSessionDate = new Date();
  }

  // End current session
  endSession() {
    if (!this.sessionData.currentSession) return null;
    
    const sessionDuration = Date.now() - this.sessionData.sessionStartTime;
    const sessionReport = {
      ...this.sessionData.currentSession,
      endTime: new Date(),
      duration: sessionDuration,
      wordsAttempted: this.sessionData.wordsAttempted.length,
      accuracy: this.sessionData.totalAnswers > 0 ? 
        (this.sessionData.correctAnswers / this.sessionData.totalAnswers) * 100 : 0
    };
    
    // Add to performance history
    this.userData.performanceHistory.push(sessionReport);
    
    // Keep only last 30 sessions
    if (this.userData.performanceHistory.length > 30) {
      this.userData.performanceHistory = this.userData.performanceHistory.slice(-30);
    }
    
    // Award badges based on performance
    if (sessionReport.accuracy === 100 && this.sessionData.totalAnswers >= 5) {
      this.awardBadge('perfect-score');
    }
    
    if (this.userData.totalWordsLearned === 1) {
      this.awardBadge('first-word');
    }
    
    // Reset session data
    this.sessionData.currentSession = null;
    this.sessionData.wordsAttempted = [];
    this.sessionData.correctAnswers = 0;
    this.sessionData.totalAnswers = 0;
    
    this.saveUserData();
    return sessionReport;
  }

  // Get comprehensive analytics report
  getAnalyticsReport() {
    const totalCategories = Object.keys(vocabularyData).length;
    const completedCategories = Object.values(this.userData.categoryProgress)
      .filter(p => p.completed).length;
    
    const recentSessions = this.userData.performanceHistory.slice(-7);
    const averageAccuracy = recentSessions.length > 0 ? 
      recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length : 0;
    
    const averageSessionTime = recentSessions.length > 0 ?
      recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length : 0;

    return {
      userId: this.userData.userId,
      childName: this.userData.childName,
      totalSessions: this.userData.totalSessions,
      totalWordsLearned: this.userData.totalWordsLearned,
      currentStreak: this.userData.currentStreak,
      completionRate: (completedCategories / totalCategories) * 100,
      averageAccuracy: Math.round(averageAccuracy),
      averageSessionTime: Math.round(averageSessionTime / 60000), // Convert to minutes
      categoryProgress: this.userData.categoryProgress,
      badges: this.userData.badges,
      performanceHistory: this.userData.performanceHistory,
      recommendations: this.generateRecommendations()
    };
  }

  // Generate learning recommendations
  generateRecommendations() {
    const recommendations = [];
    const categoryProgress = this.userData.categoryProgress;
    
    // Find categories that need attention
    Object.entries(categoryProgress).forEach(([categoryId, progress]) => {
      if (progress.accuracy < 70 && progress.wordsLearned > 0) {
        const categoryTitle = vocabularyData[categoryId]?.title || categoryId;
        recommendations.push(
          `Consider reviewing ${categoryTitle} - accuracy could be improved with more practice.`
        );
      }
      
      if (!progress.lastAccessed || 
          Date.now() - new Date(progress.lastAccessed).getTime() > 7 * 24 * 60 * 60 * 1000) {
        const categoryTitle = vocabularyData[categoryId]?.title || categoryId;
        recommendations.push(
          `Try practicing ${categoryTitle} again - it's been a while since your last session.`
        );
      }
    });
    
    // Streak recommendations
    if (this.userData.currentStreak === 0) {
      recommendations.push("Start a new learning streak - even 5 minutes a day makes a big difference!");
    } else if (this.userData.currentStreak < 3) {
      recommendations.push("Keep building your learning streak - you're doing great!");
    }
    
    // General recommendations
    if (this.userData.totalWordsLearned < 10) {
      recommendations.push("Focus on Daily Life words first - they're used most frequently.");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Excellent progress! Continue exploring new categories to expand vocabulary.");
    }
    
    return recommendations.slice(0, 3); // Return max 3 recommendations
  }

  // Utility functions
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Local storage management
  saveUserData() {
    try {
      localStorage.setItem('nepaleseFlashcardApp_userData', JSON.stringify(this.userData));
    } catch (e) {
      console.warn('Could not save user data to localStorage:', e);
    }
  }

  loadUserData() {
    try {
      const saved = localStorage.getItem('nepaleseFlashcardApp_userData');
      if (saved) {
        const parsedData = JSON.parse(saved);
        this.userData = { ...this.userData, ...parsedData };
        
        // Convert date strings back to Date objects
        if (this.userData.lastSessionDate) {
          this.userData.lastSessionDate = new Date(this.userData.lastSessionDate);
        }
        if (this.userData.startDate) {
          this.userData.startDate = new Date(this.userData.startDate);
        }
      }
    } catch (e) {
      console.warn('Could not load user data from localStorage:', e);
    }
  }

  // Reset all data (for testing or new user)
  resetUserData() {
    this.userData = {
      userId: null,
      childName: '',
      startDate: new Date(),
      totalSessions: 0,
      totalWordsLearned: 0,
      currentStreak: 0,
      lastSessionDate: null,
      categoryProgress: {},
      performanceHistory: [],
      badges: [],
      preferences: {
        difficulty: 'medium',
        learningSpeed: 'normal'
      }
    };
    
    this.sessionData = {
      currentSession: null,
      wordsAttempted: [],
      correctAnswers: 0,
      totalAnswers: 0,
      sessionStartTime: null,
      categoryScores: {}
    };
    
    this.saveUserData();
  }
}

// Create global AI service instance
window.aiService = new AIService();