import { Word, UserProgress } from '../types'

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:8000'

export async function fetchWords(): Promise<Word[]> {
  const response = await fetch(`${API_BASE}/api/words`)
  if (!response.ok) {
    throw new Error('Failed to fetch words')
  }
  return response.json()
}

export async function fetchWord(id: string): Promise<Word> {
  const response = await fetch(`${API_BASE}/api/words/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch word')
  }
  return response.json()
}

export async function fetchProgress(): Promise<UserProgress> {
  const response = await fetch(`${API_BASE}/api/progress`)
  if (!response.ok) {
    throw new Error('Failed to fetch progress')
  }
  return response.json()
}

export async function updateProgress(progress: UserProgress): Promise<void> {
  const response = await fetch(`${API_BASE}/api/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progress),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update progress')
  }
}

export async function toggleFavorite(wordId: string): Promise<{ favorites: string[] }> {
  const response = await fetch(`${API_BASE}/api/favorites/${wordId}`, {
    method: 'POST',
  })
  
  if (!response.ok) {
    throw new Error('Failed to toggle favorite')
  }
  
  return response.json()
}

export async function fetchFavorites(): Promise<Word[]> {
  const response = await fetch(`${API_BASE}/api/favorites`)
  if (!response.ok) {
    throw new Error('Failed to fetch favorites')
  }
  return response.json()
}