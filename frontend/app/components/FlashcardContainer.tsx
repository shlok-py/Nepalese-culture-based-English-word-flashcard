'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Word } from '../types'
import Flashcard from './Flashcard'

interface FlashcardContainerProps {
  word: Word
  isFavorite: boolean
  onFavorite: (wordId: string) => void
  onNext: () => void
  onPrevious: () => void
}

export default function FlashcardContainer({
  word,
  isFavorite,
  onFavorite,
  onNext,
  onPrevious
}: FlashcardContainerProps) {
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null)

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100
    
    if (info.offset.x > threshold) {
      setDragDirection('right')
      setTimeout(() => {
        onPrevious()
        setDragDirection(null)
      }, 200)
    } else if (info.offset.x < -threshold) {
      setDragDirection('left')
      setTimeout(() => {
        onNext()
        setDragDirection(null)
      }, 200)
    }
  }

  if (!word) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white text-lg">No words available</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={word.id}
          className="w-full max-w-sm"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: dragDirection === 'left' ? -300 : dragDirection === 'right' ? 300 : 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            transition: { duration: 0.2 }
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
          whileDrag={{ 
            scale: 1.05,
            rotate: dragDirection === 'left' ? -5 : dragDirection === 'right' ? 5 : 0
          }}
        >
          <Flashcard
            word={word}
            isFavorite={isFavorite}
            onFavorite={onFavorite}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}