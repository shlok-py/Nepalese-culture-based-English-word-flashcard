import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { aiService } from '../services/aiService';
import { getVocabularyByCategory, categories } from '../data/vocabulary';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface StoryModeScreenProps {
  onBack: () => void;
  childName: string;
  onComplete: () => void;
}

export function StoryModeScreen({ onBack, childName, onComplete }: StoryModeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentScene, setCurrentScene] = useState<any>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [vocabularyUsed, setVocabularyUsed] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      const vocabulary = getVocabularyByCategory(selectedCategory);
      const scene = aiService.generateStoryScene(vocabulary, sceneIndex);
      setCurrentScene(scene);
    }
  }, [selectedCategory, sceneIndex]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSceneIndex(0);
    setVocabularyUsed([]);
  };

  const handleChoiceSelect = (choice: any) => {
    // Add used vocabulary to tracking
    if (choice.vocabularyUsed.length > 0) {
      setVocabularyUsed(prev => [...prev, ...choice.vocabularyUsed]);
      
      // Show celebration for vocabulary usage
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }

    // Progress to next scene
    setTimeout(() => {
      if (sceneIndex < 3) { // Limit to 4 scenes per story
        setSceneIndex(prev => prev + 1);
      } else {
        // Story complete
        onComplete();
      }
    }, choice.vocabularyUsed.length > 0 ? 2000 : 500);
  };

  const getSceneImage = (categoryId: string, sceneIndex: number) => {
    const images = {
      'daily-life': [
        'https://via.placeholder.com/400x250/e3f2fd/1976d2?text=Nepali+Home',
        'https://via.placeholder.com/400x250/f3e5f5/7b1fa2?text=Market+Scene'
      ],
      'food': [
        'https://via.placeholder.com/400x250/fff3e0/f57c00?text=Restaurant',
        'https://via.placeholder.com/400x250/e8f5e8/388e3c?text=Kitchen'
      ],
      'festivals': [
        'https://via.placeholder.com/400x250/fce4ec/c2185b?text=Dashain+Celebration',
        'https://via.placeholder.com/400x250/fff8e1/fbc02d?text=Temple'
      ],
      'nature': [
        'https://via.placeholder.com/400x250/e0f2f1/00695c?text=Himalayan+Scene',
        'https://via.placeholder.com/400x250/f1f8e9/558b2f?text=Forest'
      ],
      'transport': [
        'https://via.placeholder.com/400x250/e8eaf6/5e35b1?text=Kathmandu+Street',
        'https://via.placeholder.com/400x250/fff3e0/ff8f00?text=Bus+Stop'
      ]
    };
    
    const categoryImages = images[categoryId as keyof typeof images] || images['daily-life'];
    return categoryImages[sceneIndex % categoryImages.length];
  };

  if (!selectedCategory) {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 pt-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-2xl p-3 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl text-gray-800">Story Time</h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
            </div>
            <p className="text-gray-600">Choose your adventure, {childName}!</p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-gray-800 text-center">Pick a story theme:</h2>
          
          <div className="space-y-3">
            {categories.map((category) => (
              <Card key={category.id} className="p-0 overflow-hidden border-2 hover:border-purple-300 transition-all">
                <Button
                  onClick={() => handleCategorySelect(category.id)}
                  className="w-full h-20 bg-white hover:bg-purple-50 text-gray-800 p-4 rounded-xl flex items-center justify-between transition-all duration-200 active:scale-95"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="text-left">
                      <div className="text-lg font-bold">{category.name} Adventures</div>
                      <div className="text-sm text-gray-600">Interactive stories with {category.name.toLowerCase()} words</div>
                    </div>
                  </div>
                  <div className="text-2xl text-purple-500">📖</div>
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <Card className="p-4 bg-blue-50 border-2 border-blue-200">
          <div className="text-center space-y-2">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto" />
            <h3 className="text-lg font-bold text-blue-800">How Story Time Works</h3>
            <p className="text-blue-700 text-sm">
              Choose a theme and follow the story! When you see vocabulary words you've learned, 
              select choices that use them. The AI will create a unique adventure just for you!
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentScene) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="text-6xl">📚</div>
          <div className="text-xl text-gray-600">AI is creating your story...</div>
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedCategory('')}
          className="text-2xl p-3 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="text-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl text-gray-800">Story Adventure</h1>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Scene {sceneIndex + 1}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{categories.find(c => c.id === selectedCategory)?.name}</p>
        </div>
        <div className="w-12" />
      </div>

      {/* Progress */}
      <div className="flex justify-center space-x-2">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index <= sceneIndex ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Vocabulary Tracker */}
      {vocabularyUsed.length > 0 && (
        <Card className="p-4 bg-green-50 border-2 border-green-200">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-green-800">Words You've Used!</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {vocabularyUsed.map((word, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Story Scene */}
      <Card className="p-6 space-y-6 bg-white border-2 border-gray-200 rounded-2xl shadow-lg">
        {/* Scene Image */}
        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
          <ImageWithFallback
            src={getSceneImage(selectedCategory, sceneIndex)}
            alt="Story scene"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Story Text */}
        <div className="text-center space-y-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-lg text-gray-800 leading-relaxed">{currentScene.text}</p>
          </div>
        </div>

        {/* Choices */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800 text-center">What happens next?</h3>
          {currentScene.choices.map((choice: any, index: number) => (
            <Button
              key={choice.id}
              onClick={() => handleChoiceSelect(choice)}
              className="w-full p-4 h-auto bg-purple-100 hover:bg-purple-200 text-purple-800 border-2 border-purple-300 rounded-xl transition-all duration-200 active:scale-95"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-left flex-1">{choice.text}</span>
                {choice.vocabularyUsed.length > 0 && (
                  <Badge variant="secondary" className="bg-purple-200 text-purple-800 ml-2">
                    +{choice.vocabularyUsed.length} word{choice.vocabularyUsed.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <Card className="p-8 text-center space-y-4 bg-white rounded-2xl shadow-2xl animate-bounce">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-green-600">Great choice, {childName}!</h2>
            <p className="text-green-700">You used vocabulary words in the story!</p>
            <div className="flex justify-center space-x-2">
              <div className="text-2xl">⭐</div>
              <div className="text-2xl">⭐</div>
              <div className="text-2xl">⭐</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}