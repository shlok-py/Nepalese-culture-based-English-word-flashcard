'use client'

import { useState, useEffect } from 'react'
import FlashcardContainer from './components/FlashcardContainer'
import Navigation from './components/Navigation'
import ProgressBar from './components/ProgressBar'
import { Word, UserProgress } from './types'
import { fetchWords, fetchProgress, updateProgress } from './services/api'

export default function Home() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState<UserProgress>({
    currentCardIndex: 0,
    favorites: [],
    completedCards: [],
    totalCardsViewed: 0,
    streakDays: 0
  })
  const [loading, setLoading] = useState(true)
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [wordsData, progressData] = await Promise.all([
        fetchWords(),
        fetchProgress()
      ])
      setWords(wordsData)
      setProgress(progressData)
      setCurrentIndex(progressData.currentCardIndex)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % words.length
    setCurrentIndex(nextIndex)
    updateUserProgress(nextIndex)
  }

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? words.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    updateUserProgress(prevIndex)
  }

  const handleFavorite = async (wordId: string) => {
    try {
      const response = await fetch(`/api/favorites/${wordId}`, {
        method: 'POST',
      })
      const data = await response.json()
      
      setProgress(prev => ({
        ...prev,
        favorites: data.favorites
      }))
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const updateUserProgress = async (index: number) => {
    const newProgress = {
      ...progress,
      currentCardIndex: index,
      totalCardsViewed: Math.max(progress.totalCardsViewed, index + 1)
    }
    
    setProgress(newProgress)
    
    try {
      await updateProgress(newProgress)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const toggleFavoritesView = () => {
    setShowFavorites(!showFavorites)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nepal-red"></div>
      </div>
    )
  }

  const displayWords = showFavorites 
    ? words.filter(word => progress.favorites.includes(word.id))
    : words

  const currentWord = displayWords[currentIndex] || words[0]

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-nepal-red text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Nepalese Flashcards</h1>
        <p className="text-center text-nepal-gold mt-1">
          Learn English through Nepali Culture
        </p>
      </header>

      <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
        <ProgressBar 
          current={currentIndex + 1} 
          total={displayWords.length}
          showFavorites={showFavorites}
          onToggleFavorites={toggleFavoritesView}
          favoritesCount={progress.favorites.length}
        />

        <FlashcardContainer
          word={currentWord}
          isFavorite={progress.favorites.includes(currentWord?.id || '')}
          onFavorite={handleFavorite}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />

        <Navigation
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={currentIndex < displayWords.length - 1}
          canGoPrevious={currentIndex > 0}
        />
      </div>

      <footer className="bg-nepal-blue text-white p-4 text-center">
        <p className="text-sm">
          Card {currentIndex + 1} of {displayWords.length} • 
          {progress.favorites.length} favorites
        </p>
      </footer>
    </main>
  )
}