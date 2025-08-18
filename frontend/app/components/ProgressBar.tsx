'use client'

interface ProgressBarProps {
  current: number
  total: number
  showFavorites: boolean
  onToggleFavorites: () => void
  favoritesCount: number
}

export default function ProgressBar({
  current,
  total,
  showFavorites,
  onToggleFavorites,
  favoritesCount
}: ProgressBarProps) {
  const progress = (current / total) * 100

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-medium">
          {showFavorites ? 'Favorites' : 'All Cards'}: {current} / {total}
        </span>
        <button
          onClick={onToggleFavorites}
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-all ${
            showFavorites
              ? 'bg-nepal-gold text-nepal-blue'
              : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
          }`}
        >
          <span>{showFavorites ? '📚 All' : '❤️ Favorites'}</span>
          {!showFavorites && favoritesCount > 0 && (
            <span className="bg-nepal-red text-white rounded-full px-2 py-0.5 text-xs">
              {favoritesCount}
            </span>
          )}
        </button>
      </div>
      
      <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
        <div
          className="bg-nepal-gold h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-white opacity-75 mt-1">
        <span>Start</span>
        <span>{Math.round(progress)}% Complete</span>
        <span>End</span>
      </div>
    </div>
  )
}