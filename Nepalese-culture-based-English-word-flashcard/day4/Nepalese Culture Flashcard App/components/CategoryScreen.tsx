import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { categories } from '../data/vocabulary';

interface CategoryScreenProps {
  onSelectCategory: (categoryId: string) => void;
  onBack: () => void;
  completedCategories: string[];
}

export function CategoryScreen({ onSelectCategory, onBack, completedCategories }: CategoryScreenProps) {
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
          <h1 className="text-2xl text-gray-800">Choose Category</h1>
          <p className="text-gray-600">Pick what you want to learn</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-4">
        {categories.map((category) => {
          const isCompleted = completedCategories.includes(category.id);
          
          return (
            <Card key={category.id} className="p-0 overflow-hidden border-2 hover:border-gray-300 transition-all">
              <Button
                onClick={() => onSelectCategory(category.id)}
                className="w-full h-28 bg-white hover:bg-gray-50 text-gray-800 p-6 rounded-xl flex items-center justify-between transition-all duration-200 active:scale-95"
              >
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="text-5xl">{category.icon}</div>
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left space-y-2">
                    <div className="text-xl font-bold">{category.name}</div>
                    <div className="text-sm text-gray-600">{category.description}</div>
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-3xl text-gray-400">→</div>
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="text-center py-4">
        <div className="text-lg text-gray-600">
          Progress: {completedCategories.length}/{categories.length} categories
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedCategories.length / categories.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}