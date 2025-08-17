import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Brain, Mic } from 'lucide-react';
import { getVocabularyByCategory, categories } from '../data/vocabulary';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SpeechRecognitionCard } from './SpeechRecognitionCard';
import { aiService } from '../services/aiService';

interface FlashcardScreenProps {
  categoryId: string;
  onComplete: () => void;
  onBack: () => void;
  childName: string;
}

export function FlashcardScreen({ categoryId, onComplete, onBack, childName }: FlashcardScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSpeechPractice, setShowSpeechPractice] = useState(false);
  const [adaptiveVocabulary, setAdaptiveVocabulary] = useState(getVocabularyByCategory(categoryId));
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [startTime, setStartTime] = useState(Date.now());
  
  const category = categories.find(c => c.id === categoryId);
  const currentWord = adaptiveVocabulary[currentIndex];
  const progress = ((currentIndex + 1) / adaptiveVocabulary.length) * 100;

  // Initialize adaptive learning sequence
  useEffect(() => {
    const vocabulary = getVocabularyByCategory(categoryId);
    const adaptiveSequence = aiService.getAdaptiveLearningSequence(categoryId, vocabulary);
    setAdaptiveVocabulary(adaptiveSequence);
    setStartTime(Date.now());
  }, [categoryId]);

  // Sample images for different vocabulary items
  const getImageUrl = (itemId: string) => {
    const imageMap: Record<string, string> = {
      'momo': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXBhbCUyMG1vbW8lMjBkdW1wbGluZ3xlbnwxfHx8fDE3NTUxMDA0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'doko': 'https://images.unsplash.com/photo-1614707055121-2d714fc2c2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXBhbCUyMHRyYWRpdGlvbmFsJTIwYmFza2V0fGVufDF8fHx8MTc1NTEwMDQxOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'himal': 'https://images.unsplash.com/photo-1665394182880-7bd84c63ebc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaW1hbGF5YSUyMG1vdW50YWluJTIwbmVwYWx8ZW58MXx8fHwxNzU1MTAwNDIyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    };
    
    return imageMap[itemId] || `https://via.placeholder.com/400x300/f0f0f0/666?text=${encodeURIComponent(currentWord?.english || 'Loading')}`;
  };

  const recordLearningAttempt = (isCorrect: boolean) => {
    const timeSpent = Date.now() - startTime;
    aiService.recordAttempt(currentWord.id, isCorrect, timeSpent);
    
    const feedback = aiService.generateFeedback(currentWord.id, isCorrect, 1);
    setAiFeedback(feedback);
    
    // Clear feedback after 3 seconds
    setTimeout(() => setAiFeedback(null), 3000);
  };

  const handleNext = () => {
    if (currentIndex < adaptiveVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStartTime(Date.now());
      setShowSpeechPractice(false);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setStartTime(Date.now());
      setShowSpeechPractice(false);
    }
  };

  const playAudio = (text: string, lang: 'en' | 'ne') => {
    console.log(`Playing audio: ${text} in ${lang}`);
    // In a real app, you would use Web Speech API
  };

  const handleSpeechResult = (isCorrect: boolean) => {
    recordLearningAttempt(isCorrect);
  };

  if (!currentWord) return null;

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
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-xl text-gray-800">{category?.name}</h1>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Brain className="w-3 h-3 mr-1" />
              AI Adaptive
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{currentIndex + 1} of {adaptiveVocabulary.length}</p>
        </div>
        <div className="w-12" />
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* AI Feedback */}
      {aiFeedback && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🤖</div>
            <div>
              <p className="font-medium text-green-800">{aiFeedback.message}</p>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 mt-1">
                Personalized AI Feedback
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Speech Recognition Mode */}
      {showSpeechPractice && (
        <SpeechRecognitionCard
          word={currentWord.english}
          language="en"
          onResult={handleSpeechResult}
          childName={childName}
        />
      )}

      {/* Regular Flashcard */}
      {!showSpeechPractice && (
        <Card className="p-6 space-y-6 bg-white border-2 border-gray-200 rounded-2xl shadow-lg">
          {/* Image */}
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <ImageWithFallback
                src={getImageUrl(currentWord.id)}
                alt={currentWord.english}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Word Information */}
          <div className="space-y-4 text-center">
            {/* English Word */}
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-3">
                <h2 className="text-3xl font-bold text-gray-800">{currentWord.english}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playAudio(currentWord.english, 'en')}
                  className="text-blue-500 hover:bg-blue-50 rounded-full p-2"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 uppercase tracking-wide">English</p>
            </div>

            {/* Nepali Word */}
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-3">
                <h3 className="text-2xl font-medium text-red-600">{currentWord.nepali}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playAudio(currentWord.nepaliRoman, 'ne')}
                  className="text-red-500 hover:bg-red-50 rounded-full p-2"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-lg text-gray-700 italic">({currentWord.nepaliRoman})</p>
              <p className="text-sm text-gray-600 uppercase tracking-wide">नेपाली</p>
            </div>

            {/* Meaning */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-lg text-gray-700">{currentWord.meaning}</p>
            </div>

            {/* Practice Button */}
            <Button
              onClick={() => setShowSpeechPractice(true)}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3"
            >
              <Mic className="w-5 h-5 mr-2" />
              Practice Pronunciation
            </Button>
          </div>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center space-x-2 text-lg px-6 py-4 h-auto"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </Button>

        <div className="flex space-x-2">
          {adaptiveVocabulary.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="flex items-center space-x-2 text-lg px-6 py-4 h-auto bg-blue-500 hover:bg-blue-600"
        >
          <span>{currentIndex === adaptiveVocabulary.length - 1 ? 'Finish' : 'Next'}</span>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}