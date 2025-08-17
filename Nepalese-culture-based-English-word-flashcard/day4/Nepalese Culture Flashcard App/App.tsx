import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { CategoryScreen } from './components/CategoryScreen';
import { FlashcardScreen } from './components/FlashcardScreen';
import { GameScreen } from './components/GameScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { StoryModeScreen } from './components/StoryModeScreen';
import { ParentDashboard } from './components/ParentDashboard';
import { aiService, LearningAnalytics } from './services/aiService';

export type Screen = 'home' | 'categories' | 'flashcards' | 'game' | 'rewards' | 'story' | 'parent-dashboard';

export interface AppState {
  currentScreen: Screen;
  selectedCategory?: string;
  completedCategories: string[];
  earnedBadges: string[];
  childName: string;
  learningAnalytics: LearningAnalytics | null;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'home',
    completedCategories: [],
    earnedBadges: [],
    childName: 'Explorer',
    learningAnalytics: null
  });

  // Initialize AI service on app start
  useEffect(() => {
    const analytics = aiService.initializeUser('user123', appState.childName);
    setAppState(prev => ({ ...prev, learningAnalytics: analytics }));
  }, []); // Empty dependency array for one-time initialization

  const navigateTo = (screen: Screen, categoryId?: string) => {
    setAppState(prev => ({
      ...prev,
      currentScreen: screen,
      selectedCategory: categoryId
    }));
  };

  const completeCategory = (categoryId: string) => {
    setAppState(prev => ({
      ...prev,
      completedCategories: [...prev.completedCategories, categoryId],
      earnedBadges: [...prev.earnedBadges, `${categoryId}-badge`]
    }));
  };

  const updateAnalytics = () => {
    const analytics = aiService.getAnalyticsReport();
    setAppState(prev => ({ ...prev, learningAnalytics: analytics }));
  };

  const renderScreen = () => {
    switch (appState.currentScreen) {
      case 'categories':
        return (
          <CategoryScreen 
            onSelectCategory={(categoryId) => navigateTo('flashcards', categoryId)}
            onBack={() => navigateTo('home')}
            completedCategories={appState.completedCategories}
          />
        );
      case 'flashcards':
        return (
          <FlashcardScreen 
            categoryId={appState.selectedCategory!}
            onComplete={() => {
              completeCategory(appState.selectedCategory!);
              updateAnalytics();
              navigateTo('game', appState.selectedCategory);
            }}
            onBack={() => navigateTo('categories')}
            childName={appState.childName}
          />
        );
      case 'game':
        return (
          <GameScreen 
            categoryId={appState.selectedCategory!}
            onComplete={() => {
              updateAnalytics();
              navigateTo('rewards');
            }}
            onBack={() => navigateTo('categories')}
            childName={appState.childName}
          />
        );
      case 'story':
        return (
          <StoryModeScreen 
            onBack={() => navigateTo('home')}
            childName={appState.childName}
            onComplete={() => {
              updateAnalytics();
              navigateTo('rewards');
            }}
          />
        );
      case 'parent-dashboard':
        return (
          <ParentDashboard 
            analytics={appState.learningAnalytics}
            childName={appState.childName}
            onBack={() => navigateTo('home')}
          />
        );
      case 'rewards':
        return (
          <RewardsScreen 
            earnedBadges={appState.earnedBadges}
            onBack={() => navigateTo('home')}
          />
        );
      default:
        return (
          <HomeScreen 
            onNavigate={navigateTo}
            completedCategories={appState.completedCategories}
            childName={appState.childName}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
      <div className="max-w-md mx-auto min-h-screen bg-white/80 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="text-8xl">🏔️</div>
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
          <div className="text-6xl">🎋</div>
        </div>
        
        {renderScreen()}
      </div>
    </div>
  );
}