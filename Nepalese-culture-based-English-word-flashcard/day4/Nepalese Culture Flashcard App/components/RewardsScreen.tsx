import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Trophy, Star, Gift } from 'lucide-react';
import { badges } from '../data/vocabulary';

interface RewardsScreenProps {
  earnedBadges: string[];
  onBack: () => void;
}

export function RewardsScreen({ earnedBadges, onBack }: RewardsScreenProps) {
  const totalBadges = badges.length;
  const earnedCount = earnedBadges.length;
  const progressPercentage = (earnedCount / totalBadges) * 100;

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
          <h1 className="text-2xl text-gray-800">Reward Room</h1>
          <p className="text-gray-600">Your amazing achievements!</p>
        </div>
      </div>

      {/* Progress Summary */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <div className="text-center space-y-4">
          <div className="text-6xl">🏆</div>
          <h2 className="text-2xl font-bold text-yellow-800">Progress Report</h2>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-yellow-600">
              {earnedCount}/{totalBadges}
            </div>
            <p className="text-yellow-700">Badges Collected</p>
            <div className="w-full bg-yellow-200 rounded-full h-4">
              <div 
                className="bg-yellow-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Achievement Message */}
      {earnedCount > 0 && (
        <Card className="p-6 bg-green-50 border-2 border-green-200">
          <div className="text-center space-y-2">
            <Star className="w-8 h-8 text-green-500 mx-auto" />
            <h3 className="text-lg font-bold text-green-800">Congratulations!</h3>
            <p className="text-green-700">
              You're doing amazing! Keep learning about Nepali culture.
            </p>
          </div>
        </Card>
      )}

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <Gift className="w-5 h-5" />
          <span>Your Badges</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {badges.map((badge) => {
            const isEarned = earnedBadges.some(eb => eb.includes(badge.id));
            
            return (
              <Card 
                key={badge.id} 
                className={`p-6 transition-all duration-300 ${
                  isEarned 
                    ? 'bg-white border-2 border-green-300 shadow-lg' 
                    : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`text-4xl ${isEarned ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`text-lg font-bold ${
                        isEarned ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {badge.name}
                      </h4>
                      {isEarned && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Earned
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${
                      isEarned ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {badge.description}
                    </p>
                  </div>
                  {isEarned && (
                    <div className="text-green-500">
                      <Trophy className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Motivational Message */}
      <Card className="p-6 bg-blue-50 border-2 border-blue-200">
        <div className="text-center space-y-2">
          <div className="text-4xl">🌟</div>
          <h3 className="text-lg font-bold text-blue-800">Keep Going!</h3>
          <p className="text-blue-700">
            {earnedCount === 0 
              ? "Start learning to earn your first badge!"
              : earnedCount === totalBadges
                ? "Amazing! You've collected all badges! 🎉"
                : "You're doing great! Keep learning to earn more badges!"
            }
          </p>
        </div>
      </Card>

      {/* Cultural Footer */}
      <div className="flex justify-center space-x-6 py-4 opacity-40">
        <div className="text-3xl">🏔️</div>
        <div className="text-3xl">🇳🇵</div>
        <div className="text-3xl">🏔️</div>
      </div>
    </div>
  );
}