import { VocabularyItem } from '../data/vocabulary';

export interface LearningAnalytics {
  userId: string;
  wordPerformance: Record<string, WordPerformance>;
  categoryProgress: Record<string, CategoryProgress>;
  overallStats: OverallStats;
  learningPath: string[];
  lastUpdated: Date;
}

export interface WordPerformance {
  wordId: string;
  attempts: number;
  correct: number;
  incorrect: number;
  averageTimeSpent: number;
  lastPracticed: Date;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'mastered';
  difficultyScore: number; // 0-1, higher = more difficult for this user
}

export interface CategoryProgress {
  categoryId: string;
  wordsLearned: number;
  totalWords: number;
  averageAccuracy: number;
  timeSpent: number;
  strengthLevel: 'weak' | 'moderate' | 'strong' | 'excellent';
}

export interface OverallStats {
  totalWordsLearned: number;
  totalTimeSpent: number;
  averageAccuracy: number;
  streakDays: number;
  favoriteCategory: string;
  improvementRate: number;
}

export interface AIFeedback {
  message: string;
  type: 'encouragement' | 'correction' | 'achievement' | 'suggestion';
  personalized: boolean;
}

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  accuracy: number;
  feedback: string;
  isCorrect: boolean;
}

export interface StoryScene {
  id: string;
  text: string;
  choices: StoryChoice[];
  vocabularyWords: string[];
  imagePrompt: string;
}

export interface StoryChoice {
  id: string;
  text: string;
  nextSceneId: string;
  vocabularyUsed: string[];
}

class AIService {
  private analytics: LearningAnalytics | null = null;
  private childName: string = 'Explorer'; // Default name

  // Initialize or load user analytics
  initializeUser(userId: string, name?: string): LearningAnalytics {
    if (name) this.childName = name;
    
    // In a real app, this would load from a database
    this.analytics = {
      userId,
      wordPerformance: {},
      categoryProgress: {},
      overallStats: {
        totalWordsLearned: 0,
        totalTimeSpent: 0,
        averageAccuracy: 0,
        streakDays: 1,
        favoriteCategory: '',
        improvementRate: 0
      },
      learningPath: [],
      lastUpdated: new Date()
    };
    
    return this.analytics;
  }

  // Record learning attempt
  recordAttempt(wordId: string, isCorrect: boolean, timeSpent: number): void {
    if (!this.analytics) return;

    const performance = this.analytics.wordPerformance[wordId] || {
      wordId,
      attempts: 0,
      correct: 0,
      incorrect: 0,
      averageTimeSpent: 0,
      lastPracticed: new Date(),
      masteryLevel: 'beginner' as const,
      difficultyScore: 0.5
    };

    performance.attempts++;
    performance.averageTimeSpent = ((performance.averageTimeSpent * (performance.attempts - 1)) + timeSpent) / performance.attempts;
    performance.lastPracticed = new Date();

    if (isCorrect) {
      performance.correct++;
    } else {
      performance.incorrect++;
    }

    // Update mastery level based on performance
    const accuracy = performance.correct / performance.attempts;
    if (accuracy >= 0.9 && performance.attempts >= 5) {
      performance.masteryLevel = 'mastered';
      performance.difficultyScore = 0.1;
    } else if (accuracy >= 0.7) {
      performance.masteryLevel = 'advanced';
      performance.difficultyScore = 0.3;
    } else if (accuracy >= 0.5) {
      performance.masteryLevel = 'intermediate';
      performance.difficultyScore = 0.5;
    } else {
      performance.difficultyScore = 0.8;
    }

    this.analytics.wordPerformance[wordId] = performance;
    this.updateLearningPath();
  }

  // Generate adaptive learning path
  private updateLearningPath(): void {
    if (!this.analytics) return;

    const words = Object.values(this.analytics.wordPerformance);
    
    // Sort by difficulty score (highest first) and recency
    const adaptivePath = words
      .filter(word => word.masteryLevel !== 'mastered')
      .sort((a, b) => {
        // Prioritize difficult words and words not practiced recently
        const difficultyWeight = (b.difficultyScore - a.difficultyScore) * 0.7;
        const recencyWeight = (Date.now() - a.lastPracticed.getTime() - (Date.now() - b.lastPracticed.getTime())) * 0.3 / (24 * 60 * 60 * 1000);
        return difficultyWeight + recencyWeight;
      })
      .map(word => word.wordId);

    this.analytics.learningPath = adaptivePath;
  }

  // Get next words to practice based on adaptive algorithm
  getAdaptiveLearningSequence(categoryId: string, vocabulary: VocabularyItem[]): VocabularyItem[] {
    if (!this.analytics) return vocabulary;

    const categoryWords = vocabulary.filter(word => word.category === categoryId);
    const learningPath = this.analytics.learningPath;
    
    // Reorder based on learning path
    const reorderedWords = categoryWords.sort((a, b) => {
      const aIndex = learningPath.indexOf(a.id);
      const bIndex = learningPath.indexOf(b.id);
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });

    return reorderedWords;
  }

  // Generate personalized AI feedback
  generateFeedback(wordId: string, isCorrect: boolean, attempts: number): AIFeedback {
    const performance = this.analytics?.wordPerformance[wordId];
    const messages = {
      encouragement: [
        `Great work, ${this.childName}! You're getting better at this!`,
        `Wonderful progress, ${this.childName}! Keep it up!`,
        `You're doing amazing, ${this.childName}! 🌟`,
        `Fantastic effort, ${this.childName}! You're learning so fast!`
      ],
      correction: [
        `That's okay, ${this.childName}! Let's try again together.`,
        `No worries, ${this.childName}! Learning takes practice.`,
        `Good try, ${this.childName}! You'll get it next time!`,
        `Keep going, ${this.childName}! You're almost there!`
      ],
      achievement: [
        `Incredible, ${this.childName}! You mastered this word! 🎉`,
        `Amazing work, ${this.childName}! You're a vocabulary star! ⭐`,
        `Wow, ${this.childName}! You got it right faster than last time!`,
        `Excellent, ${this.childName}! You're becoming an expert!`
      ],
      suggestion: [
        `${this.childName}, try saying it slowly first.`,
        `Remember, ${this.childName}, take your time to think.`,
        `${this.childName}, you can do this! Focus on the sound.`,
        `Great effort, ${this.childName}! Let's practice this one more time.`
      ]
    };

    let type: AIFeedback['type'] = 'encouragement';
    
    if (isCorrect && performance && performance.masteryLevel === 'mastered') {
      type = 'achievement';
    } else if (isCorrect) {
      type = 'encouragement';
    } else if (attempts > 2) {
      type = 'suggestion';
    } else {
      type = 'correction';
    }

    const messageArray = messages[type];
    const message = messageArray[Math.floor(Math.random() * messageArray.length)];

    return {
      message,
      type,
      personalized: true
    };
  }

  // Simulate speech recognition
  async recognizeSpeech(expectedWord: string, audioBlob?: Blob): Promise<SpeechRecognitionResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate speech recognition result
    const variations = [expectedWord.toLowerCase(), expectedWord.toLowerCase() + 's', expectedWord.toLowerCase().slice(0, -1)];
    const recognizedText = variations[Math.floor(Math.random() * variations.length)];
    
    const confidence = 0.7 + Math.random() * 0.3;
    const isCorrect = recognizedText.toLowerCase() === expectedWord.toLowerCase();
    const accuracy = isCorrect ? 0.9 + Math.random() * 0.1 : 0.3 + Math.random() * 0.4;
    
    let feedback: string;
    if (isCorrect) {
      feedback = `Perfect pronunciation, ${this.childName}! 🎉`;
    } else if (accuracy > 0.6) {
      feedback = `Close! Try saying "${expectedWord}" a bit clearer.`;
    } else {
      feedback = `Let's practice together! Say "${expectedWord}" slowly.`;
    }

    return {
      text: recognizedText,
      confidence,
      accuracy,
      feedback,
      isCorrect
    };
  }

  // Generate interactive story scenes
  generateStoryScene(categoryWords: VocabularyItem[], sceneIndex: number = 0): StoryScene {
    const stories = {
      'daily-life': [
        {
          text: "Ama is getting ready for the market. She needs to carry vegetables.",
          choices: [
            { text: "Use the doko (basket)", vocab: ['doko'] },
            { text: "Use hands only", vocab: [] }
          ]
        },
        {
          text: "At the market, Ama sees her friend wearing something special on his head.",
          choices: [
            { text: "It's a beautiful topi (cap)!", vocab: ['topi'] },
            { text: "It's just hair", vocab: [] }
          ]
        }
      ],
      'food': [
        {
          text: "Ramesh is hungry and goes to a restaurant. What should he order?",
          choices: [
            { text: "Delicious momo (dumplings)", vocab: ['momo'] },
            { text: "Fresh sel roti (ring bread)", vocab: ['sel-roti'] }
          ]
        },
        {
          text: "After eating, Ramesh wants something warm to drink.",
          choices: [
            { text: "Hot chiya (tea)", vocab: ['chiya'] },
            { text: "Cold water", vocab: [] }
          ]
        }
      ]
    };

    const categoryStories = stories[categoryWords[0]?.category as keyof typeof stories] || stories['daily-life'];
    const story = categoryStories[sceneIndex % categoryStories.length];
    
    return {
      id: `scene_${sceneIndex}`,
      text: story.text,
      choices: story.choices.map((choice, index) => ({
        id: `choice_${index}`,
        text: choice.text,
        nextSceneId: `scene_${sceneIndex + 1}`,
        vocabularyUsed: choice.vocab
      })),
      vocabularyWords: categoryWords.map(w => w.id),
      imagePrompt: `Nepali cultural scene: ${story.text}`
    };
  }

  // Get analytics for parent dashboard
  getAnalyticsReport(): LearningAnalytics | null {
    return this.analytics;
  }

  // Generate parent insights
  generateParentInsights(): string[] {
    if (!this.analytics) return [];

    const insights = [];
    const categories = Object.values(this.analytics.categoryProgress);
    const words = Object.values(this.analytics.wordPerformance);
    
    // Strongest category - only if there are categories
    if (categories.length > 0) {
      const strongest = categories.reduce((prev, current) => 
        prev.averageAccuracy > current.averageAccuracy ? prev : current
      );
      insights.push(`🌟 ${this.childName} excels at ${strongest.categoryId} with ${Math.round(strongest.averageAccuracy * 100)}% accuracy!`);
    }

    // Improvement suggestions - only if there are words with performance data
    if (words.length > 0) {
      const weakWords = words.filter(w => w.difficultyScore > 0.6).slice(0, 3);
      if (weakWords.length > 0) {
        insights.push(`📚 Practice these words at home: ${weakWords.map(w => w.wordId).join(', ')}`);
      }
    }

    // Streak encouragement
    if (this.analytics.overallStats.streakDays > 1) {
      insights.push(`🔥 Amazing ${this.analytics.overallStats.streakDays}-day learning streak!`);
    }

    // Default insights if no data is available yet
    if (insights.length === 0) {
      insights.push(`🌱 ${this.childName} is just getting started! Keep exploring to unlock personalized insights.`);
      insights.push(`📖 Try the Story Mode for interactive learning adventures!`);
      insights.push(`🎤 Practice pronunciation with the speech recognition feature.`);
    }

    return insights;
  }
}

export const aiService = new AIService();