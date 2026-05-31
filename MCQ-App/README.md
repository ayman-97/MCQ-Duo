# 🎮 MCQ Duo - Gamified Learning App

A highly addictive, mobile-first MCQ (Multiple Choice Questions) learning web app inspired by Duo's progression mechanics. Combines a beautiful Duo-style progression map with fast-paced, high-feedback interaction mechanics.

## 🌟 Features

### 🎯 Core Mechanics
- **Duo-Style Progression Map**: SVG-based winding path with interactive level nodes
- **Level States**: Locked, Current (pulsing), Completed (with 1-3 star ratings)
- **Read-First Mechanic**: Questions require reading before options become clickable (1.5s)
- **Real-time Feedback**: 
  - ✅ Correct: Pop sound + micro-vibration + green highlight
  - ❌ Wrong: Thud sound + screen shake + red highlight
  - Auto-advance after 1.2 seconds

### 🎨 Design
- **Dark Cyberpunk Theme**: #0F172A background with neon accent colors
- **60fps Smooth Animations**: Framer Motion for fluid interactions
- **Glassmorphism Cards**: Semi-transparent UI with backdrop blur
- **Mobile-First Responsive**: Touch-optimized with large targets

### 🌍 Internationalization
- **Bilingual Support**: English/Arabic with automatic RTL layout
- **Bilingual Questions**: Display English with Arabic translations
- **Bilingual Explanations**: Detailed explanations in both languages

### 📊 Progress & Gamification
- **XP System**: Earn XP based on accuracy (100 + accuracy% bonus)
- **Star Ratings**: 1-3 stars based on accuracy (50%+, 70%+, 90%+)
- **Persistent Progress**: localStorage integration via Zustand
- **Subject Progress Bar**: Visual representation of completion percentage
- **Level Completion Screen**: Confetti animations, accuracy %, XP earned

## 🏗️ Architecture

```
MCQ-App/
├── scripts/
│   └── duo_parser.py          # Data pipeline: .docx → JSON
├── src/
│   ├── app/
│   │   ├── components/        # React components
│   │   │   ├── GameHome.tsx
│   │   │   ├── ProgressionMap.tsx
│   │   │   ├── QuizInterface.tsx
│   │   │   ├── LevelCompleteScreen.tsx
│   │   │   ├── SubjectSelector.tsx
│   │   │   └── UIComponents.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── store/
│   │   └── gameStore.ts       # Zustand state management
│   ├── lib/
│   │   ├── quizLoader.ts      # Data loading utilities
│   │   ├── audioUtils.ts      # Sound & haptic feedback
│   │   └── calculations.ts    # Game logic utilities
│   └── data/
│       └── db.json            # Generated quiz database
├── subjects_vault/            # Input .docx files by subject
│   ├── AI/
│   ├── Operating Systems/
│   └── ...
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare Quiz Data
Create your subject folders in `subjects_vault/`:
```
subjects_vault/
├── AI/
│   └── questions.docx
├── Operating Systems/
│   └── questions.docx
└── Database Systems/
    └── questions.docx
```

Each .docx file should follow this format:
```
Q1: Your question here?
A) First option
B) Second option*
C) Third option
D) Fourth option
This is the explanation for why B is correct.
```

### 3. Parse Data
```bash
npm run parse
```
This converts .docx files to `src/data/db.json` with structured questions organized into levels.

### 4. Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`

### 5. Production Build
```bash
npm run build
npm start
```

## 🎮 Gameplay Loop

1. **Subject Selection**: Choose a subject from the top dropdown
2. **Progression Map**: See your learning path with level nodes
3. **Level Selection**: Click a "Current" level to start (others are locked)
4. **Quiz Interface**:
   - Read the question (options are blurred for 1.5s)
   - Select an option (enabled after reading timer)
   - Get instant feedback with sound/haptics
   - View explanation
   - Auto-advance to next question
5. **Level Complete**: 
   - See accuracy %, stars earned, and XP
   - Next level unlocks automatically
   - Return to map to continue

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS 3 + custom animations
- **Animations**: Framer Motion 10
- **State Management**: Zustand 4 (with localStorage persistence)
- **Data Pipeline**: Python 3 + python-docx
- **Audio/Haptics**: Web Audio API + Vibration API

## 📱 Responsive Design

- **Desktop**: Full progression map view (400px wide)
- **Tablet**: Optimized scrolling, touch-friendly buttons
- **Mobile**: Single-column layout, full-height quiz interface, haptic feedback

## 🎨 Customization

### Theme Colors (tailwind.config.js)
```js
colors: {
  dark: { 900: "#0F172A", 800: "#1E293B", 700: "#334155" },
  neon: {
    green: "#10B981",
    pink: "#EC4899",
    blue: "#3B82F6",
    purple: "#A855F7",
    cyan: "#06B6D4",
  },
}
```

### Questions Per Level (scripts/duo_parser.py)
```python
QUESTIONS_PER_LEVEL = 10  # Modify this value
```

### Read-First Duration (src/app/components/QuizInterface.tsx)
```typescript
const READ_TIME = 1.5; // seconds before options unlock
```

## 🔊 Audio Feedback

- **Pop Sound** (Correct): 800Hz → 100Hz frequency sweep
- **Thud Sound** (Wrong): 150Hz → 50Hz frequency sweep
- **Level Up Jingle** (Complete): Ascending C5-E5-G5 chord progression

## ✨ Advanced Features

### Data Pipeline Features
- Automatic question extraction from .docx files
- Multi-subject support with automatic chunking
- Bilingual placeholder generation (ready for translation)
- Metadata generation (total subjects, questions, etc.)

### Game State Features
- Zustand persistence layer with localStorage
- Per-level tracking (stars, accuracy, XP)
- Subject-wide progress aggregation
- Per-question answer history

### UI/UX Features
- Smooth SVG path animations for progression map
- Glassmorphism with backdrop blur effects
- Toast-like explanations
- Adaptive haptic feedback patterns
- Confetti animation on level complete

## 🐛 Troubleshooting

### No subjects showing up?
- Ensure .docx files are in `subjects_vault/Subject Name/`
- Run `npm run parse` to generate db.json
- Restart dev server

### Audio not working?
- Check browser console for errors
- Ensure browser has Web Audio API support
- Mobile browsers may require user gesture first

### Haptics not working?
- Only supported on mobile/touch devices
- Check browser Vibration API support
- Some devices may not have vibration hardware

## 📝 License

MIT

## 🎓 Educational Use

Perfect for:
- Competitive exam preparation (GATE, IIT-JEE, etc.)
- CS concept mastery
- Interview preparation
- Classroom gamification

---

**Built with ❤️ for lifelong learners** 🚀
