// Main Application JavaScript
class NepalFlashcardApp {
  constructor() {
    this.currentScreen = 'home';
    this.selectedCategory = null;
    this.completedCategories = [];
    this.earnedBadges = [];
    this.childName = 'Explorer';
    this.currentFlashcardIndex = 0;
    this.currentWords = [];
    this.gameState = {
      score: 0,
      round: 1,
      totalRounds: 3,
      currentWord: null,
      options: [],
      selectedOption: null
    };
    this.storyState = {
      currentStory: null,
      currentScene: null,
      sceneIndex: 0
    };
    
    // Initialize app
    this.init();
  }

  init() {
    // Initialize AI service
    const analytics = aiService.initializeUser('user123', this.childName);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize home screen
    this.updateProgressSummary();
    this.updateCompletedCategories();
    this.showScreen('home');
  }

  setupEventListeners() {
    // Navigation buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-screen]')) {
        const screen = e.target.getAttribute('data-screen');
        const categoryId = e.target.getAttribute('data-category');
        this.navigateTo(screen, categoryId);
      }
      
      if (e.target.matches('[data-category]')) {
        const categoryId = e.target.getAttribute('data-category');
        this.selectCategory(categoryId);
      }
      
      if (e.target.matches('[data-story]')) {
        const storyId = e.target.getAttribute('data-story');
        this.startStory(storyId);
      }
    });

    // Flashcard controls
    document.getElementById('prev-btn')?.addEventListener('click', () => this.previousFlashcard());
    document.getElementById('next-btn')?.addEventListener('click', () => this.nextFlashcard());
    document.getElementById('speak-btn')?.addEventListener('click', () => this.speakWord());
    document.getElementById('complete-flashcards')?.addEventListener('click', () => this.completeFlashcards());

    // Game event listeners
    document.addEventListener('click', (e) => {
      if (e.target.matches('.word-option')) {
        this.selectGameOption(e.target);
      }
    });

    // Story controls
    document.getElementById('story-back')?.addEventListener('click', () => this.showStorySelection());
    document.getElementById('story-complete')?.addEventListener('click', () => this.completeStory());
    
    document.addEventListener('click', (e) => {
      if (e.target.matches('.story-choice')) {
        this.selectStoryChoice(e.target);
      }
    });
  }

  navigateTo(screen, categoryId = null) {
    this.selectedCategory = categoryId;
    this.showScreen(screen);
  }

  showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
      targetScreen.classList.add('active');
      targetScreen.classList.add('fade-in');
    }
    
    this.currentScreen = screenName;
    
    // Initialize screen-specific content
    switch (screenName) {
      case 'home':
        this.updateProgressSummary();
        break;
      case 'categories':
        this.updateCategoriesScreen();
        break;
      case 'flashcards':
        this.initializeFlashcards();
        break;
      case 'game':
        this.initializeGame();
        break;
      case 'story':
        this.initializeStoryMode();
        break;
      case 'rewards':
        this.updateRewardsScreen();
        break;
      case 'parent-dashboard':
        this.updateParentDashboard();
        break;
    }
  }

  // Home Screen Methods
  updateProgressSummary() {
    const progressGrid = document.getElementById('progress-grid');
    if (!progressGrid) return;
    
    progressGrid.innerHTML = '';
    
    Object.entries(vocabularyData).forEach(([categoryId, category]) => {
      const isCompleted = this.completedCategories.includes(categoryId);
      
      const progressItem = document.createElement('div');
      progressItem.className = `progress-item ${isCompleted ? 'completed' : ''}`;
      progressItem.innerHTML = `
        <div class="progress-item-icon">${category.icon}</div>
        <div class="progress-item-label">${category.title}</div>
      `;
      
      progressGrid.appendChild(progressItem);
    });
  }

  // Categories Screen Methods
  updateCategoriesScreen() {
    const categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = '';
    
    Object.entries(vocabularyData).forEach(([categoryId, category]) => {
      const isCompleted = this.completedCategories.includes(categoryId);
      
      const categoryCard = document.createElement('div');
      categoryCard.className = `category-card ${isCompleted ? 'completed' : ''}`;
      categoryCard.setAttribute('data-category', categoryId);
      categoryCard.innerHTML = `
        <div class="category-icon">${category.icon}</div>
        <div class="category-title">${category.title}</div>
        <div class="category-subtitle">${category.subtitle}</div>
        ${isCompleted ? '<div class="category-progress">✅ Completed</div>' : ''}
      `;
      
      categoriesGrid.appendChild(categoryCard);
    });
  }

  selectCategory(categoryId) {
    this.selectedCategory = categoryId;
    this.navigateTo('flashcards', categoryId);
  }

  // Flashcard Screen Methods
  initializeFlashcards() {
    if (!this.selectedCategory || !vocabularyData[this.selectedCategory]) return;
    
    aiService.startSession(this.selectedCategory);
    this.currentWords = aiService.getNextWords(this.selectedCategory, 8);
    this.currentFlashcardIndex = 0;
    
    const categoryTitle = document.getElementById('flashcard-category-title');
    if (categoryTitle) {
      categoryTitle.textContent = vocabularyData[this.selectedCategory].title;
    }
    
    this.updateFlashcard();
    this.updateFlashcardProgress();
  }

  updateFlashcard() {
    if (this.currentWords.length === 0) return;
    
    const word = this.currentWords[this.currentFlashcardIndex];
    
    document.getElementById('word-image').textContent = word.image;
    document.getElementById('english-word').textContent = word.english;
    document.getElementById('nepali-word').textContent = word.nepali;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) prevBtn.disabled = this.currentFlashcardIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentFlashcardIndex >= this.currentWords.length - 1;
  }

  updateFlashcardProgress() {
    const progressFill = document.getElementById('flashcard-progress');
    if (progressFill && this.currentWords.length > 0) {
      const progress = ((this.currentFlashcardIndex + 1) / this.currentWords.length) * 100;
      progressFill.style.width = `${progress}%`;
    }
  }

  previousFlashcard() {
    if (this.currentFlashcardIndex > 0) {
      this.currentFlashcardIndex--;
      this.updateFlashcard();
      this.updateFlashcardProgress();
    }
  }

  nextFlashcard() {
    if (this.currentFlashcardIndex < this.currentWords.length - 1) {
      this.currentFlashcardIndex++;
      this.updateFlashcard();
      this.updateFlashcardProgress();
    }
  }

  speakWord() {
    if ('speechSynthesis' in window) {
      const word = this.currentWords[this.currentFlashcardIndex];
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    } else {
      // Fallback: show visual feedback
      const speakBtn = document.getElementById('speak-btn');
      if (speakBtn) {
        speakBtn.textContent = '🔊 Playing...';
        setTimeout(() => {
          speakBtn.textContent = '🔊 Listen';
        }, 1000);
      }
    }
  }

  completeFlashcards() {
    // Record learning progress
    this.currentWords.forEach(word => {
      aiService.recordWordAttempt(word.id, this.selectedCategory, true, 3000);
    });
    
    if (!this.completedCategories.includes(this.selectedCategory)) {
      this.completedCategories.push(this.selectedCategory);
      this.earnedBadges.push(`${this.selectedCategory}-badge`);
    }
    
    this.navigateTo('game', this.selectedCategory);
  }

  // Game Screen Methods
  initializeGame() {
    if (!this.selectedCategory || !vocabularyData[this.selectedCategory]) return;
    
    this.gameState = {
      score: 0,
      round: 1,
      totalRounds: 3,
      currentWord: null,
      options: [],
      selectedOption: null
    };
    
    this.updateGameStats();
    this.nextGameRound();
  }

  nextGameRound() {
    if (this.gameState.round > this.gameState.totalRounds) {
      this.completeGame();
      return;
    }
    
    // Get random word from current category
    const categoryWords = vocabularyData[this.selectedCategory].words;
    this.gameState.currentWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    
    // Generate options (3 wrong + 1 correct)
    const allWords = Object.values(vocabularyData)
      .flatMap(cat => cat.words)
      .filter(word => word.id !== this.gameState.currentWord.id);
    
    const wrongOptions = this.shuffleArray(allWords).slice(0, 3);
    this.gameState.options = this.shuffleArray([...wrongOptions, this.gameState.currentWord]);
    
    this.updateGameDisplay();
    this.clearGameFeedback();
  }

  updateGameDisplay() {
    // Update target word
    const targetWord = document.getElementById('target-word');
    if (targetWord) {
      targetWord.innerHTML = `
        <span class="target-text">${this.gameState.currentWord.english}</span>
      `;
    }
    
    // Update options
    const wordOptions = document.getElementById('word-options');
    if (wordOptions) {
      wordOptions.innerHTML = '';
      
      this.gameState.options.forEach((word, index) => {
        const option = document.createElement('button');
        option.className = 'word-option';
        option.textContent = word.nepali;
        option.setAttribute('data-word-id', word.id);
        wordOptions.appendChild(option);
      });
    }
  }

  selectGameOption(optionElement) {
    const wordId = optionElement.getAttribute('data-word-id');
    const isCorrect = wordId === this.gameState.currentWord.id;
    
    // Record attempt
    aiService.recordWordAttempt(wordId, this.selectedCategory, isCorrect, 2000);
    
    // Update option appearance
    document.querySelectorAll('.word-option').forEach(opt => {
      opt.classList.remove('selected', 'correct', 'incorrect');
      if (opt.getAttribute('data-word-id') === this.gameState.currentWord.id) {
        opt.classList.add('correct');
      } else if (opt === optionElement && !isCorrect) {
        opt.classList.add('incorrect');
      }
    });
    
    // Show feedback
    this.showGameFeedback(isCorrect);
    
    if (isCorrect) {
      this.gameState.score += 10;
    }
    
    this.updateGameStats();
    
    // Continue to next round after delay
    setTimeout(() => {
      this.gameState.round++;
      this.nextGameRound();
    }, 2000);
  }

  showGameFeedback(isCorrect) {
    const feedback = document.getElementById('game-feedback');
    if (feedback) {
      if (isCorrect) {
        feedback.textContent = 'Excellent! ✨ Great job!';
        feedback.className = 'game-feedback correct';
      } else {
        feedback.textContent = `Good try! The answer was: ${this.gameState.currentWord.nepali}`;
        feedback.className = 'game-feedback incorrect';
      }
    }
  }

  clearGameFeedback() {
    const feedback = document.getElementById('game-feedback');
    if (feedback) {
      feedback.textContent = '';
      feedback.className = 'game-feedback';
    }
  }

  updateGameStats() {
    document.getElementById('game-score').textContent = this.gameState.score;
    document.getElementById('game-round').textContent = this.gameState.round;
  }

  completeGame() {
    const sessionReport = aiService.endSession();
    const accuracy = sessionReport ? sessionReport.accuracy : 0;
    
    // Show completion message
    const gameInstruction = document.getElementById('game-instruction');
    if (gameInstruction) {
      const feedback = aiService.generatePersonalizedFeedback(accuracy, this.selectedCategory, this.childName);
      gameInstruction.innerHTML = `
        <div style="text-align: center;">
          <h3>🎉 Game Complete!</h3>
          <p>Final Score: ${this.gameState.score}</p>
          <p>${feedback}</p>
          <button class="complete-btn" onclick="app.navigateTo('rewards')">View Rewards</button>
        </div>
      `;
    }
  }

  // Story Mode Methods
  initializeStoryMode() {
    this.showStorySelection();
  }

  showStorySelection() {
    document.getElementById('story-selection').style.display = 'block';
    document.getElementById('story-content').style.display = 'none';
  }

  startStory(storyId) {
    if (!storyData[storyId]) return;
    
    this.storyState.currentStory = storyData[storyId];
    this.storyState.currentScene = this.storyState.currentStory.scenes[0];
    this.storyState.sceneIndex = 0;
    
    document.getElementById('story-selection').style.display = 'none';
    document.getElementById('story-content').style.display = 'block';
    
    this.updateStoryDisplay();
  }

  updateStoryDisplay() {
    const scene = this.storyState.currentScene;
    if (!scene) return;
    
    document.getElementById('scene-image').textContent = scene.image;
    document.getElementById('story-text').textContent = scene.text;
    
    const choicesContainer = document.getElementById('story-choices');
    choicesContainer.innerHTML = '';
    
    scene.choices.forEach((choice, index) => {
      const choiceBtn = document.createElement('button');
      choiceBtn.className = 'story-choice';
      choiceBtn.textContent = choice.text;
      choiceBtn.setAttribute('data-next-scene', choice.next);
      choiceBtn.setAttribute('data-word', choice.word || '');
      choicesContainer.appendChild(choiceBtn);
    });
    
    // Show/hide complete button
    const completeBtn = document.getElementById('story-complete');
    if (completeBtn) {
      completeBtn.style.display = scene.choices.length === 0 ? 'block' : 'none';
    }
  }

  selectStoryChoice(choiceElement) {
    const nextSceneId = choiceElement.getAttribute('data-next-scene');
    const word = choiceElement.getAttribute('data-word');
    
    // Record word learning if applicable
    if (word && this.selectedCategory) {
      aiService.recordWordAttempt(word, this.selectedCategory, true, 1000);
    }
    
    // Find next scene
    const nextScene = this.storyState.currentStory.scenes.find(s => s.id === nextSceneId);
    if (nextScene) {
      this.storyState.currentScene = nextScene;
      this.storyState.sceneIndex++;
      this.updateStoryDisplay();
    }
  }

  completeStory() {
    // Award story badge
    const storiesCompleted = (this.earnedBadges.filter(b => b.includes('story')).length || 0) + 1;
    if (storiesCompleted >= 3) {
      this.earnedBadges.push('story-master');
    }
    
    aiService.endSession();
    this.navigateTo('rewards');
  }

  // Rewards Screen Methods
  updateRewardsScreen() {
    this.updateBadgesDisplay();
    this.updateStatsDisplay();
  }

  updateBadgesDisplay() {
    const badgesGrid = document.getElementById('badges-grid');
    if (!badgesGrid) return;
    
    badgesGrid.innerHTML = '';
    
    badgeData.forEach(badge => {
      const isEarned = this.earnedBadges.includes(badge.id);
      
      const badgeCard = document.createElement('div');
      badgeCard.className = `badge-card ${isEarned ? 'earned' : 'locked'}`;
      badgeCard.innerHTML = `
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-title">${badge.title}</div>
      `;
      
      badgesGrid.appendChild(badgeCard);
    });
  }

  updateStatsDisplay() {
    const analytics = aiService.getAnalyticsReport();
    
    document.getElementById('words-learned').textContent = analytics.totalWordsLearned;
    document.getElementById('accuracy-rate').textContent = `${analytics.averageAccuracy}%`;
    document.getElementById('streak-days').textContent = analytics.currentStreak;
    document.getElementById('total-score').textContent = analytics.totalSessions * 50; // Mock score
  }

  // Parent Dashboard Methods
  updateParentDashboard() {
    const analytics = aiService.getAnalyticsReport();
    
    // Update summary cards
    document.getElementById('total-sessions').textContent = analytics.totalSessions;
    document.getElementById('avg-session-time').textContent = `${analytics.averageSessionTime} min`;
    document.getElementById('completion-rate').textContent = `${Math.round(analytics.completionRate)}%`;
    
    // Update category progress
    this.updateCategoryProgressList(analytics.categoryProgress);
    
    // Update recommendations
    this.updateRecommendationsList(analytics.recommendations);
    
    // Update performance chart (mock)
    this.updatePerformanceChart();
  }

  updateCategoryProgressList(categoryProgress) {
    const progressList = document.getElementById('category-progress-list');
    if (!progressList) return;
    
    progressList.innerHTML = '';
    
    Object.entries(categoryProgress).forEach(([categoryId, progress]) => {
      const category = vocabularyData[categoryId];
      if (!category) return;
      
      const progressPercentage = Math.round((progress.wordsLearned / progress.totalWords) * 100);
      
      const progressItem = document.createElement('div');
      progressItem.className = 'progress-item-detailed';
      progressItem.innerHTML = `
        <div class="progress-header">
          <span class="progress-category">${category.title}</span>
          <span class="progress-percentage">${progressPercentage}%</span>
        </div>
        <div class="progress-bar-detailed">
          <div class="progress-fill-detailed" style="width: ${progressPercentage}%"></div>
        </div>
      `;
      
      progressList.appendChild(progressItem);
    });
  }

  updateRecommendationsList(recommendations) {
    const recommendationList = document.getElementById('recommendation-list');
    if (!recommendationList) return;
    
    recommendationList.innerHTML = '';
    
    recommendations.forEach(recommendation => {
      const recommendationItem = document.createElement('div');
      recommendationItem.className = 'recommendation-item';
      recommendationItem.innerHTML = `
        <div class="recommendation-text">${recommendation}</div>
      `;
      
      recommendationList.appendChild(recommendationItem);
    });
  }

  updatePerformanceChart() {
    const chartContainer = document.getElementById('performance-chart');
    if (chartContainer) {
      chartContainer.innerHTML = '<div style="color: #6b7280; font-style: italic;">Performance chart visualization would appear here</div>';
    }
  }

  // Utility Methods
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  updateCompletedCategories() {
    // Sync with AI service data
    const analytics = aiService.getAnalyticsReport();
    this.completedCategories = Object.entries(analytics.categoryProgress)
      .filter(([_, progress]) => progress.completed)
      .map(([categoryId, _]) => categoryId);
    
    this.earnedBadges = analytics.badges;
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new NepalFlashcardApp();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
  // Add any resize-specific logic here if needed
});

// Handle visibility change for session tracking
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // App going to background - could pause session timer
  } else {
    // App coming to foreground - could resume session timer
  }
});

// Handle beforeunload for saving data
window.addEventListener('beforeunload', () => {
  aiService.saveUserData();
});