"use client";

import React from "react";
import { motion } from "framer-motion";
import { calculateStars } from "@/lib/calculations";
import { feedback } from "@/lib/audioUtils";

interface LevelCompleteScreenProps {
  levelNumber: number;
  accuracy: number;
  xpEarned: number;
  correctAnswers: number;
  totalQuestions: number;
  onReturnToMap: () => void;
}

export const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  levelNumber,
  accuracy,
  xpEarned,
  correctAnswers,
  totalQuestions,
  onReturnToMap,
}) => {
  const stars = calculateStars(accuracy);

  React.useEffect(() => {
    feedback.levelUp();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-gradient-to-b from-dark-800 to-dark-900 rounded-2xl p-8 max-w-md w-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
      >
        {/* Confetti animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{
                x: Math.random() * 300 - 150,
                y: -20,
              }}
              animate={{
                x: Math.random() * 300 - 150,
                y: 400,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random(),
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Title */}
          <motion.h1
            className="text-4xl font-bold text-yellow-400 mb-2"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Level Complete! 🎉
          </motion.h1>

          <motion.p
            className="text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Level {levelNumber}
          </motion.p>

          {/* Stars */}
          <motion.div
            className="flex justify-center gap-2 mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="text-4xl"
                animate={i < stars ? { scale: [1, 1.3, 1] } : {}}
                transition={{
                  delay: 0.9 + i * 0.2,
                  duration: 0.6,
                  times: [0, 0.5, 1],
                }}
              >
                {i < stars ? "⭐" : "☆"}
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="bg-dark-700/50 rounded-lg p-6 mb-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Accuracy</span>
              <motion.span
                className="text-2xl font-bold text-green-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 }}
              >
                {accuracy}%
              </motion.span>
            </div>

            <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${accuracy}%` }}
                transition={{ delay: 1.3, duration: 1 }}
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-dark-600">
              <span className="text-gray-400">Correct Answers</span>
              <span className="text-xl font-bold text-blue-400">
                {correctAnswers}/{totalQuestions}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">XP Earned</span>
              <motion.span
                className="text-xl font-bold text-yellow-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4 }}
              >
                +{xpEarned} XP
              </motion.span>
            </div>
          </motion.div>

          {/* Return Button */}
          <motion.button
            onClick={onReturnToMap}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return to Map
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
