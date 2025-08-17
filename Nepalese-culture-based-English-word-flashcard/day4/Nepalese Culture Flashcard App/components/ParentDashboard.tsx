import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, TrendingUp, Brain, Clock, Target, Star, BookOpen } from 'lucide-react';
import { LearningAnalytics, aiService } from '../services/aiService';

interface ParentDashboardProps {
  analytics: LearningAnalytics | null;
  childName: string;
  onBack: () => void;
}

export function ParentDashboard({ analytics, childName, onBack }: ParentDashboardProps) {
  const insights = aiService.generateParentInsights();

  if (!analytics) {
    return (
      <div className="p-6 space-y-6">
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
            <h1 className="text-2xl text-gray-800">Parent Dashboard</h1>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500">No learning data available yet.</p>
          <p className="text-sm text-gray-400 mt-2">Analytics will appear once {childName} starts learning!</p>
        </div>
      </div>
    );
  }

  const categoryProgress = Object.values(analytics.categoryProgress);
  const wordPerformance = Object.values(analytics.wordPerformance);
  
  // Calculate metrics safely
  const totalWords = wordPerformance.length;
  const masteredWords = wordPerformance.filter(w => w.masteryLevel === 'mastered').length;
  const averageAccuracy = analytics.overallStats.averageAccuracy * 100;
  const strugglingWords = wordPerformance.filter(w => w.difficultyScore > 0.6).slice(0, 5);
  const strongCategories = categoryProgress
    .filter(c => c.averageAccuracy > 0.7)
    .sort((a, b) => b.averageAccuracy - a.averageAccuracy);

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
            <h1 className="text-2xl text-gray-800">Parent Dashboard</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Brain className="w-3 h-3 mr-1" />
              AI Insights
            </Badge>
          </div>
          <p className="text-gray-600">{childName}'s Learning Journey</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-green-50 border-2 border-green-200">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-green-600">{masteredWords}</div>
            <div className="text-sm text-green-700">Words Mastered</div>
            <div className="text-xs text-green-600">out of {totalWords} learned</div>
          </div>
        </Card>
        
        <Card className="p-4 bg-blue-50 border-2 border-blue-200">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-blue-600">{Math.round(averageAccuracy)}%</div>
            <div className="text-sm text-blue-700">Average Accuracy</div>
            <div className="text-xs text-blue-600">across all activities</div>
          </div>
        </Card>
      </div>

      {/* Learning Streak */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">🔥</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-orange-800">Learning Streak</h3>
            <p className="text-orange-700">
              {childName} has been learning for <span className="font-bold">{analytics.overallStats.streakDays} days</span> in a row!
            </p>
            <div className="mt-2">
              <div className="flex items-center space-x-2 text-sm text-orange-600">
                <Clock className="w-4 h-4" />
                <span>Total time: {Math.round(analytics.overallStats.totalTimeSpent / 60)} minutes</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="p-6 bg-purple-50 border-2 border-purple-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-purple-800">AI Learning Insights</h3>
          </div>
          
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-purple-200">
                <p className="text-purple-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Category Performance */}
      {strongCategories.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-bold text-gray-800">Strongest Categories</h3>
            </div>
            
            <div className="space-y-3">
              {strongCategories.slice(0, 3).map((category) => (
                <div key={category.categoryId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 capitalize">{category.categoryId.replace('-', ' ')}</span>
                    <span className="text-sm text-gray-600">{Math.round(category.averageAccuracy * 100)}%</span>
                  </div>
                  <Progress value={category.averageAccuracy * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Words to Practice */}
      {strugglingWords.length > 0 && (
        <Card className="p-6 bg-yellow-50 border-2 border-yellow-200">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-bold text-yellow-800">Words to Practice at Home</h3>
            </div>
            
            <p className="text-yellow-700 text-sm">
              These words need more practice. Try using them in daily conversations!
            </p>
            
            <div className="flex flex-wrap gap-2">
              {strugglingWords.map((word) => (
                <Badge key={word.wordId} variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {word.wordId}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Suggested Activities */}
      <Card className="p-6 bg-blue-50 border-2 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-800">Suggested Home Activities</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-medium text-blue-800">Kitchen Learning</h4>
              <p className="text-blue-700 text-sm">Name cooking utensils and ingredients in both English and Nepali while preparing meals.</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-medium text-blue-800">Story Time</h4>
              <p className="text-blue-700 text-sm">Create stories together using the vocabulary words {childName} has learned.</p>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <h4 className="font-medium text-blue-800">Cultural Connection</h4>
              <p className="text-blue-700 text-sm">Visit Nepali cultural events or restaurants to practice vocabulary in real settings.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Timeline */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Learning Progress</h3>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-lg text-gray-700">
              {childName} is making excellent progress! Keep up the wonderful work!
            </div>
            <div className="text-sm text-gray-600">
              Last updated: {analytics.lastUpdated.toLocaleDateString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Cultural Footer */}
      <div className="flex justify-center space-x-6 py-4 opacity-40">
        <div className="text-3xl">🏔️</div>
        <div className="text-3xl">📚</div>
        <div className="text-3xl">🇳🇵</div>
        <div className="text-3xl">👨‍👩‍👧‍👦</div>
      </div>
    </div>
  );
}