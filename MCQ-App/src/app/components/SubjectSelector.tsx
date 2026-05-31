"use client";

import React from "react";
import { motion } from "framer-motion";

interface SubjectSelectorProps {
  subjects: string[];
  currentSubject: string;
  onSubjectChange: (subject: string) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subjects,
  currentSubject,
  onSubjectChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-dark-800 hover:bg-dark-700 text-white font-bold px-6 py-3 rounded-lg flex justify-between items-center transition-all"
      >
        <span>{currentSubject}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      {isOpen && (
        <motion.div
          className="absolute top-full left-0 right-0 mt-2 bg-dark-800 rounded-lg overflow-hidden shadow-lg z-40"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => {
                onSubjectChange(subject);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-3 text-left transition-all ${
                subject === currentSubject
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-dark-700"
              }`}
            >
              {subject}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

interface SubjectProgressBarProps {
  subject: string;
  completed: number;
  total: number;
  xp: number;
}

export const SubjectProgressBar: React.FC<SubjectProgressBarProps> = ({
  subject,
  completed,
  total,
  xp,
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <motion.div
      className="bg-dark-800 rounded-lg p-4 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-bold">{subject} Progress</h3>
        <span className="text-blue-400 font-bold">
          {completed}/{total} Levels
        </span>
      </div>

      <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden mb-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">{Math.round(percentage)}% Complete</span>
        <span className="text-yellow-400 text-sm font-bold">⭐ {xp} XP</span>
      </div>
    </motion.div>
  );
};
