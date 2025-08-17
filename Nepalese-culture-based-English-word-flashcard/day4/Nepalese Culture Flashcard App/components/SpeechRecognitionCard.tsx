import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Mic, MicOff, Volume2, CheckCircle, AlertTriangle } from 'lucide-react';
import { aiService } from '../services/aiService';

interface SpeechRecognitionCardProps {
  word: string;
  language: 'en' | 'ne';
  onResult: (isCorrect: boolean) => void;
  childName: string;
}

export function SpeechRecognitionCard({ word, language, onResult, childName }: SpeechRecognitionCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = async () => {
    setIsRecording(true);
    setResult(null);
    
    // Simulate recording for 3 seconds
    setTimeout(async () => {
      setIsRecording(false);
      setIsProcessing(true);
      
      try {
        const speechResult = await aiService.recognizeSpeech(word);
        setResult(speechResult);
        onResult(speechResult.isCorrect);
      } catch (error) {
        console.error('Speech recognition error:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 3000);
  };

  const playWord = () => {
    console.log(`Playing audio: ${word} in ${language}`);
    // In a real app, use Web Speech API
  };

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          🎤 Pronunciation Practice
        </Badge>
        <h3 className="text-xl font-bold text-gray-800">
          Say: "<span className="text-blue-600">{word}</span>"
        </h3>
      </div>

      {/* Listen button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={playWord}
          className="flex items-center space-x-2"
        >
          <Volume2 className="w-4 h-4" />
          <span>Listen</span>
        </Button>
      </div>

      {/* Recording controls */}
      <div className="text-center space-y-4">
        {!result && (
          <Button
            onClick={startRecording}
            disabled={isRecording || isProcessing}
            className={`w-24 h-24 rounded-full text-white transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isRecording ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
        )}

        {isRecording && (
          <div className="space-y-2">
            <p className="text-green-600 font-medium">🎤 Listening...</p>
            <p className="text-sm text-gray-600">Speak clearly!</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-8 bg-green-400 rounded animate-pulse"></div>
              <div className="w-2 h-6 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-10 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-4 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <p className="text-blue-600 font-medium">🤖 AI is listening...</p>
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {result && (
          <div className="space-y-4 p-4 rounded-xl bg-white border-2">
            <div className="flex items-center justify-center space-x-2">
              {result.isCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Perfect! 🎉
                  </Badge>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Keep trying! 💪
                  </Badge>
                </>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                You said: "<span className="font-medium">{result.text}</span>"
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-blue-700 font-medium">{result.feedback}</p>
              </div>
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <span>Confidence: {Math.round(result.confidence * 100)}%</span>
                <span>Accuracy: {Math.round(result.accuracy * 100)}%</span>
              </div>
            </div>

            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setResult(null);
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}