'use client'

interface NavigationProps {
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export default function Navigation({
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious
}: NavigationProps) {
  return (
    <div className="flex justify-between items-center mt-6 px-4">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
          canGoPrevious
            ? 'bg-nepal-blue text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        aria-label="Previous card"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Previous</span>
      </button>

      <div className="text-white text-center">
        <p className="text-sm opacity-75">Swipe or use buttons</p>
        <div className="flex space-x-1 mt-1">
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
          canGoNext
            ? 'bg-nepal-red text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        aria-label="Next card"
      >
        <span>Next</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}