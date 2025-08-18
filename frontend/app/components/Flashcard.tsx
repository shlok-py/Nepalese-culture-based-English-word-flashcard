'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Word } from '../types'

interface FlashcardProps {
  word: Word
  isFavorite: boolean
  onFavorite: (wordId: string) => void
}

export default function Flashcard({ word, isFavorite, onFavorite }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavorite(word.id)
  }

  return (
    <div className="relative w-full h-96 cursor-pointer" onClick={handleFlip}>
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-xl shadow-2xl p-6 flex flex-col justify-center items-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <button
            onClick={handleFavorite}
            className={`absolute top-4 right-4 text-2xl transition-colors ${
              isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-nepal-red mb-4">
              {word.english}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {word.nepaliContext}
            </p>
            <div className="bg-nepal-gold bg-opacity-20 rounded-lg p-3 mb-4">
              <p className="text-nepal-blue font-medium">
                {word.meaning}
              </p>
            </div>
            <p className="text-sm text-gray-500 italic">
              Tap to see example & cultural note
            </p>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              word.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              word.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {word.difficulty}
            </span>
            <span className="px-2 py-1 bg-nepal-blue bg-opacity-10 text-nepal-blue rounded text-xs font-medium">
              {word.category}
            </span>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-nepal-blue to-nepal-red rounded-xl shadow-2xl p-6 flex flex-col justify-center text-white"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <button
            onClick={handleFavorite}
            className={`absolute top-4 right-4 text-2xl transition-colors ${
              isFavorite ? 'text-red-300' : 'text-white hover:text-red-300'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>

          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-nepal-gold mb-4">
              Example & Culture
            </h3>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-nepal-gold mb-2">Example:</h4>
              <p className="text-lg italic">
                "{word.example}"
              </p>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold text-nepal-gold mb-2">Cultural Note:</h4>
              <p className="text-sm">
                {word.culturalNote}
              </p>
            </div>

            <p className="text-xs text-nepal-gold opacity-75 mt-4">
              Tap to flip back
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}