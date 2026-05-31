"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import {
  getSubjects,
  getSubjectLevels,
  getLevel,
} from "@/lib/quizLoader";
import { ProgressionMap } from "./ProgressionMap";
import { SubjectSelector, SubjectProgressBar } from "./SubjectSelector";
import { QuizInterface } from "./QuizInterface";
import { LevelCompleteScreen } from "./LevelCompleteScreen";

export const GameHome: React.FC = () => {
  const {
    currentSubject,
    setCurrentSubject,
    currentLevel,
    setCurrentLevel,
    completeLevel,
    getSubjectProgress,
    totalXP,
  } = useGameStore();

  const [subjects, setSubjects] = useState<string[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [levelStats, setLevelStats] = useState({
    accuracy: 0,
    xpEarned: 0,
  });

  // Load available subjects
  useEffect(() => {
    const availableSubjects = getSubjects();
    setSubjects(availableSubjects);
    if (availableSubjects.length > 0 && !availableSubjects.includes(currentSubject)) {
      setCurrentSubject(availableSubjects[0]);
    }
  }, []);

  // Load levels for current subject
  useEffect(() => {
    const subjectLevels = getSubjectLevels(currentSubject);
    setLevels(subjectLevels);
  }, [currentSubject]);

  const handleSubjectChange = (subject: string) => {
    setCurrentSubject(subject);
    setCurrentLevel(null);
  };

  const handleLevelClick = (levelIndex: number) => {
    setCurrentLevel(levelIndex);
  };

  const handleQuizComplete = (stats: { accuracy: number; xpEarned: number }) => {
    setLevelStats(stats);
    completeLevel(currentSubject, currentLevel!, stats);
    
    // Calculate correct answers
    const levelQuestions = getLevel(currentSubject, currentLevel!);
    const correct = Math.round((stats.accuracy / 100) * levelQuestions.length);
    
    setShowLevelComplete(true);
  };

  const handleReturnToMap = () => {
    setShowLevelComplete(false);
    setCurrentLevel(null);
  };

  const handleExitQuiz = () => {
    setCurrentLevel(null);
  };

  const progress = getSubjectProgress(currentSubject);

  // Quiz view
  if (currentLevel !== null && levels[currentLevel]) {
    return (
      <>
        <QuizInterface
          subject={currentSubject}
          levelIndex={currentLevel}
          questions={levels[currentLevel]}
          onComplete={handleQuizComplete}
          onExit={handleExitQuiz}
        />
        {showLevelComplete && (
          <LevelCompleteScreen
            levelNumber={currentLevel + 1}
            accuracy={levelStats.accuracy}
            xpEarned={levelStats.xpEarned}
            correctAnswers={Math.round((levelStats.accuracy / 100) * levels[currentLevel].length)}
            totalQuestions={levels[currentLevel].length}
            onReturnToMap={handleReturnToMap}
          />
        )}
      </>
    );
  }

  // Map view
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                MCQ Duo
              </h1>
              <p className="text-gray-400 mt-2">Master your knowledge with style</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Total XP</p>
              <motion.div
                className="text-3xl font-bold text-yellow-400"
                key={totalXP}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                ⭐ {totalXP}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Subject Selector and Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {subjects.length > 0 && (
            <>
              <SubjectSelector
                subjects={subjects}
                currentSubject={currentSubject}
                onSubjectChange={handleSubjectChange}
              />
              <SubjectProgressBar
                subject={currentSubject}
                completed={progress.completed}
                total={progress.total}
                xp={progress.xp}
              />
            </>
          )}
        </motion.div>

        {/* Progression Map */}
        {levels.length > 0 ? (
          <motion.div
            className="bg-dark-800/50 backdrop-blur rounded-2xl p-6 border border-dark-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Learning Path</h2>
            <ProgressionMap
              subject={currentSubject}
              levels={levels}
              onLevelClick={handleLevelClick}
            />
          </motion.div>
        ) : (
          <motion.div
            className="bg-dark-800 rounded-lg p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400">
              No levels available yet. Add .docx files to subjects_vault/ and run `npm run parse`
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          className="text-center mt-8 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>💎 Gamified learning. Zero distractions. Maximum growth.</p>
        </motion.div>
      </div>
    </div>
  );
};
