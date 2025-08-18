# Nepalese Culture-based English Word Flashcard App

A Progressive Web App (PWA) that helps users learn English vocabulary through Nepalese cultural context. Built with FastAPI backend and Next.js frontend.

## Features

- 🇳🇵 **Cultural Learning**: English words with Nepalese cultural context and examples
- 📱 **Mobile-First Design**: Touch-optimized with smooth swipe animations
- 💾 **Progress Tracking**: Save learning progress and favorites
- 🌐 **PWA Support**: Install as an app, works offline
- ❤️ **Favorites System**: Mark and review favorite words
- ♿ **Accessible**: Screen reader support and keyboard navigation

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and gestures

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nepalese-flashcard-app
   ```

2. **Run the setup script**
   ```bash
   python setup.py
   ```

3. **Start the application**
   ```bash
   python run.py
   ```

   Or manually:
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   # Windows
   venv\Scripts\python main.py
   # Unix/Linux/macOS
   venv/bin/python main.py
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Project Structure

```
/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Python virtual environment
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── public/            # Static assets
│   │   ├── manifest.json  # PWA manifest
│   │   ├── sw.js         # Service worker
│   │   └── icons/        # App icons
│   ├── package.json       # Node.js dependencies
│   └── tailwind.config.js # Tailwind configuration
├── data/
│   └── words.json         # Flashcard data
├── .kiro/                 # Kiro AI steering files
│   └── steering/
│       ├── product.md     # Product overview
│       ├── tech.md        # Technology stack
│       └── structure.md   # Project structure
├── setup.py               # Setup script
├── run.py                 # Run script
└── README.md              # This file
```

## API Endpoints

- `GET /api/words` - Get all flashcard words
- `GET /api/words/{word_id}` - Get specific word
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update user progress
- `POST /api/favorites/{word_id}` - Toggle favorite status
- `GET /api/favorites` - Get favorite words

## Development

### Adding New Words

Edit `data/words.json` to add new vocabulary words:

```json
{
  "id": "word_006",
  "english": "Khukuri",
  "nepaliContext": "Traditional curved knife of Nepal",
  "meaning": "A curved blade tool used in Nepal",
  "example": "The Gurkha soldier carried his khukuri with pride.",
  "culturalNote": "Symbol of bravery and Nepali heritage",
  "image": "/images/cards/khukuri.jpg",
  "difficulty": "intermediate",
  "category": "culture"
}
```

### Customizing Styles

The app uses Tailwind CSS with custom Nepal-themed colors:
- `nepal-red`: #DC143C
- `nepal-blue`: #003893  
- `nepal-gold`: #FFD700

### PWA Configuration

The app is configured as a PWA with:
- Offline support via service worker
- App installation prompts
- Custom app icons and splash screens

## Deployment

### Backend Deployment
- Deploy FastAPI app to platforms like Heroku, Railway, or DigitalOcean
- Set environment variables for production
- Use PostgreSQL or MongoDB for persistent storage

### Frontend Deployment
- Deploy Next.js app to Vercel, Netlify, or similar
- Update API endpoints in production
- Configure PWA settings for your domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Cultural Guidelines

- All content must be culturally accurate and respectful
- Images should be copyright-safe (Creative Commons, public domain, or original)
- Cultural context should be authentic and reviewed by native speakers
- Maintain sensitivity to Nepali culture and traditions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Nepali cultural consultants for authentic content
- Open source community for tools and libraries
- Contributors and testers