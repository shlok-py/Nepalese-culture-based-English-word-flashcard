export interface Word {
  id: string
  english: string
  nepaliContext: string
  meaning: string
  example: string
  culturalNote: string
  image: string
  difficulty: string
  category: string
}

export interface UserProgress {
  currentCardIndex: number
  favorites: string[]
  completedCards: string[]
  totalCardsViewed: number
  streakDays: number
}