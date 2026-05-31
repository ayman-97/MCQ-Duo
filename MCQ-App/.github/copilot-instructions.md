# MCQ Learning App - Project Setup Guide

## Project Overview
This is a gamified MCQ learning application combining:
- Duolingo-style progression map with level-based learning
- Dark theme cyberpunk aesthetic
- Mobile-first responsive design
- Smooth 60fps animations with Framer Motion
- Bilingual UI support (English/Arabic with RTL)
- Audio feedback and haptic vibrations
- Zustand state management with localStorage persistence

## Architecture
- **Frontend**: Next.js 14 + React 18 + Tailwind CSS
- **State Management**: Zustand with localStorage
- **Animations**: Framer Motion
- **Python Pipeline**: Data extraction from .docx files

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Data Parser
Add your .docx files to `subjects_vault/` organized by subject folder:
```
subjects_vault/
├── AI/
│   └── questions.docx
├── Operating Systems/
│   └── questions.docx
```

Then run:
```bash
npm run parse
```

This generates `src/data/db.json` with the structured quiz data.

### 3. Development
```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## File Structure
- `scripts/duo_parser.py` - Data pipeline for .docx parsing
- `src/app/` - Next.js pages and app router
- `src/components/` - React components (ProgressionMap, QuizInterface, etc.)
- `src/store/` - Zustand stores for game state
- `src/lib/` - Utility functions
- `src/data/db.json` - Generated quiz database
- `subjects_vault/` - Input .docx files

## Key Features
- ✅ SVG-based progression map with animated nodes
- ✅ Level states: Locked, Current, Completed (with star ratings)
- ✅ Mobile-optimized touch interactions
- ✅ Bilingual question display
- ✅ Read-first mechanic (blurred options)
- ✅ Real-time feedback with animations
- ✅ Score tracking and XP system
- ✅ Glassmorphic UI components
