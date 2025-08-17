import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Screen } from '../App';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  completedCategories: string[];
  childName: string;
}

export function HomeScreen({ onNavigate, completedCategories, childName }: HomeScreenProps) {
  const menuItems = [
    {
      id: 'learn',
      title: 'Learn Words',
      subtitle: 'Discover new vocabulary',
      icon: '📚',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => onNavigate('categories')
    },
    {
      id: 'play',
      title: 'Play & Match',
      subtitle: 'Fun learning games',
      icon: '🎮',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onNavigate('categories')
    },
    {
      id: 'story',
      title: 'Story Time',
      subtitle: 'Interactive adventures',
      icon: '📖',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => onNavigate('story'),
      badge: 'AI Powered'
    },
    {
      id: 'rewards',
      title: 'Reward Room',
      subtitle: 'See your badges',
      icon: '🏆',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => onNavigate('rewards')
    },
    {
      id: 'parent',
      title: 'Parent Dashboard',
      subtitle: 'Learning insights',
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => onNavigate('parent-dashboard'),
      badge: 'AI Insights'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 pt-8">
        <div className="text-6xl mb-4">🇳🇵</div>
        <h1 className="text-3xl text-red-600 font-bold">Nepal Learning</h1>
        <p className="text-lg text-gray-600">
          Welcome back, <span className="font-bold text-blue-600">{childName}</span>!
        </p>
        <p className="text-sm text-gray-500">Learn English through Nepali culture with AI</p>
        
        {completedCategories.length > 0 && (
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🌟 {completedCategories.length} categories completed!
          </Badge>
        )}
      </div>

      {/* Menu Buttons */}
      <div className="space-y-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="p-0 overflow-hidden border-2 border-gray-200">
            <Button
              onClick={item.action}
              disabled={item.disabled}
              className={`w-full h-24 ${item.color} text-white text-xl font-bold p-6 rounded-xl flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{item.icon}</span>
                <div className="text-left">
                  <div className="text-xl flex items-center space-x-2">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm font-normal opacity-90">{item.subtitle}</div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </Button>
          </Card>
        ))}
      </div>

      {/* Cultural decorations */}
      <div className="flex justify-center space-x-8 py-6 opacity-30">
        <div className="text-4xl">🏔️</div>
        <div className="text-4xl">🥟</div>
        <div className="text-4xl">🎋</div>
        <div className="text-4xl">🏠</div>
      </div>
    </div>
  );
}