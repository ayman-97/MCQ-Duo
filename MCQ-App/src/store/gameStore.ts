import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LevelState {
  stars: number; // 0-3
  completed: boolean;
  accuracy: number; // percentage
  xpEarned: number;
}

export interface SubjectProgress {
  [levelIndex: number]: LevelState;
}

export interface GameStore {
  // User data
  totalXP: number;
  currentSubject: string;
  
  // Progress tracking
  subjectProgress: {
    [subject: string]: SubjectProgress;
  };
  
  // Current quiz state
  currentLevel: number | null;
  currentQuestion: number;
  currentScore: number;
  currentAnswers: string[]; // Track user answers
  
  // Actions
  setCurrentSubject: (subject: string) => void;
  setCurrentLevel: (level: number | null) => void;
  
  // Quiz progression
  nextQuestion: () => void;
  resetQuiz: () => void;
  recordAnswer: (questionIndex: number, answer: string) => void;
  
  // Level completion
  completeLevel: (subject: string, levelIndex: number, stats: {
    accuracy: number;
    xpEarned: number;
  }) => void;
  
  // Progress queries
  getLevelState: (subject: string, levelIndex: number) => LevelState;
  getSubjectProgress: (subject: string) => { completed: number; total: number; xp: number };
  
  // Persistence helpers
  clearAllProgress: () => void;
}

const defaultLevelState: LevelState = {
  stars: 0,
  completed: false,
  accuracy: 0,
  xpEarned: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      totalXP: 0,
      currentSubject: "AI",
      subjectProgress: {},
      currentLevel: null,
      currentQuestion: 0,
      currentScore: 0,
      currentAnswers: [],

      setCurrentSubject: (subject: string) => {
        set({ currentSubject: subject });
      },

      setCurrentLevel: (level: number | null) => {
        set({
          currentLevel: level,
          currentQuestion: 0,
          currentScore: 0,
          currentAnswers: [],
        });
      },

      nextQuestion: () => {
        set((state) => ({
          currentQuestion: state.currentQuestion + 1,
        }));
      },

      resetQuiz: () => {
        set({
          currentLevel: null,
          currentQuestion: 0,
          currentScore: 0,
          currentAnswers: [],
        });
      },

      recordAnswer: (questionIndex: number, answer: string) => {
        set((state) => {
          const newAnswers = [...state.currentAnswers];
          newAnswers[questionIndex] = answer;
          return { currentAnswers: newAnswers };
        });
      },

      completeLevel: (subject: string, levelIndex: number, stats) => {
        set((state) => {
          const newProgress = { ...state.subjectProgress };
          if (!newProgress[subject]) {
            newProgress[subject] = {};
          }

          // Calculate stars based on accuracy
          let stars = 0;
          if (stats.accuracy >= 90) stars = 3;
          else if (stats.accuracy >= 70) stars = 2;
          else if (stats.accuracy >= 50) stars = 1;

          newProgress[subject][levelIndex] = {
            stars,
            completed: true,
            accuracy: stats.accuracy,
            xpEarned: stats.xpEarned,
          };

          return {
            subjectProgress: newProgress,
            totalXP: state.totalXP + stats.xpEarned,
          };
        });
      },

      getLevelState: (subject: string, levelIndex: number) => {
        const state = get();
        return (
          state.subjectProgress[subject]?.[levelIndex] || { ...defaultLevelState }
        );
      },

      getSubjectProgress: (subject: string) => {
        const state = get();
        const progress = state.subjectProgress[subject] || {};

        const completed = Object.values(progress).filter(
          (level) => level.completed
        ).length;

        const xp = Object.values(progress).reduce(
          (sum, level) => sum + level.xpEarned,
          0
        );

        return { completed, total: Object.keys(progress).length, xp };
      },

      clearAllProgress: () => {
        set({
          totalXP: 0,
          subjectProgress: {},
          currentLevel: null,
          currentQuestion: 0,
          currentScore: 0,
          currentAnswers: [],
        });
      },
    }),
    {
      name: "mcq-game-store",
      version: 1,
    }
  )
);
