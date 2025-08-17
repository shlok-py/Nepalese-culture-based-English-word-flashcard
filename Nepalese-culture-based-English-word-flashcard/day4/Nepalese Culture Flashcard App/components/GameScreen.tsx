import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeft, Star, Volume2 } from 'lucide-react';
import { getVocabularyByCategory, categories } from '../data/vocabulary';

interface GameScreenProps {
  categoryId: string;
  onComplete: () => void;
  onBack: () => void;
  childName: string;
}

interface GameItem {
  id: string;
  word: string;
  found: boolean;
  position: { x: number; y: number };
}

export function GameScreen({ categoryId, onComplete, onBack, childName }: GameScreenProps) {
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const vocabulary = getVocabularyByCategory(categoryId);
  const category = categories.find(c => c.id === categoryId);
  const progress = (score / vocabulary.length) * 100;

  useEffect(() => {
    // Initialize game items with random positions
    const vocab = getVocabularyByCategory(categoryId);
    const items: GameItem[] = vocab.map((item, index) => ({
      id: item.id,
      word: item.english,
      found: false,
      position: {
        x: 20 + (index % 3) * 30 + Math.random() * 10,
        y: 20 + Math.floor(index / 3) * 25 + Math.random() * 10
      }
    }));
    
    setGameItems(items);
    setCurrentTarget(items[0]?.word || '');
    setScore(0);
    setGameComplete(false);
    setShowCelebration(false);
  }, [categoryId]);

  const handleItemClick = (itemId: string) => {
    const item = gameItems.find(i => i.id === itemId);
    if (!item || item.found) return;
    
    if (item.word === currentTarget) {
      // Correct answer
      setGameItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, found: true } : i
      ));
      setScore(prev => prev + 1);
      setShowCelebration(true);
      
      // Find next target
      const remainingItems = gameItems.filter(i => !i.found && i.id !== itemId);
      if (remainingItems.length > 0) {
        setTimeout(() => {
          setCurrentTarget(remainingItems[0].word);
          setShowCelebration(false);
        }, 1500);
      } else {
        // Game complete
        setTimeout(() => {
          setGameComplete(true);
        }, 1500);
      }
    }
  };

  const playTargetAudio = () => {
    console.log(`Playing audio for: ${currentTarget}`);
    // In a real app, use Web Speech API
  };

  const getSceneDescription = () => {
    switch (categoryId) {
      case 'daily-life':
        return 'A traditional Nepali home with everyday items';
      case 'food':
        return 'A bustling Nepali kitchen and dining area';
      case 'festivals':
        return 'A colorful Dashain celebration scene';
      case 'nature':
        return 'Beautiful Himalayan landscape with wildlife';
      case 'transport':
        return 'Busy streets of Kathmandu with vehicles';
      default:
        return 'A Nepali cultural scene';
    }
  };

  if (gameComplete) {
    return (
      <div className="p-6 space-y-8 text-center">
        <div className="pt-8">
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Congratulations!</h1>
          <p className="text-lg text-gray-600 mb-4">You found all items!</p>
          <div className="text-6xl mb-4">⭐ ⭐ ⭐</div>
          <div className="bg-green-100 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-green-800 mb-2">Badge Earned!</h2>
            <div className="text-4xl mb-2">{category?.icon}</div>
            <p className="text-green-700">{category?.name} Expert</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={onComplete}
            className="w-full text-xl py-6 bg-green-500 hover:bg-green-600"
          >
            Collect Reward! 🏆
          </Button>
          <Button 
            variant="outline"
            onClick={onBack}
            className="w-full text-lg py-4"
          >
            Back to Categories
          </Button>
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
          onClick={onBack}
          className="text-2xl p-3 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl text-gray-800">Find & Name</h1>
          <p className="text-sm text-gray-600">{category?.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-bold">{score}</span>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-3" />

      {/* Current Target */}
      <Card className="p-4 bg-blue-50 border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 uppercase tracking-wide mb-1">Find this:</p>
            <h2 className="text-2xl font-bold text-blue-800">{currentTarget}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={playTargetAudio}
            className="text-blue-500 hover:bg-blue-100 rounded-full p-3"
          >
            <Volume2 className="w-6 h-6" />
          </Button>
        </div>
      </Card>

      {/* Game Scene */}
      <Card className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100 border-2 border-gray-200 overflow-hidden">
        {/* Scene Description */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm text-gray-700 text-center">{getSceneDescription()}</p>
          </div>
        </div>

        {/* Interactive Items */}
        {gameItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            disabled={item.found}
            className={`absolute w-16 h-16 rounded-full border-4 transition-all duration-300 ${
              item.found
                ? 'bg-green-500 border-green-600 text-white cursor-default'
                : item.word === currentTarget
                  ? 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600 animate-pulse'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            style={{
              left: `${item.position.x}%`,
              top: `${item.position.y}%`
            }}
          >
            {item.found ? '✓' : '?'}
          </Button>
        ))}

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="text-center animate-bounce">
              <div className="text-8xl mb-4">🎉</div>
              <p className="text-2xl font-bold text-green-600">Great job!</p>
            </div>
          </div>
        )}
      </Card>

      {/* Instructions */}
      <div className="text-center text-gray-600">
        <p>Tap the items in the scene to find the word "{currentTarget}"</p>
      </div>
    </div>
  );
}