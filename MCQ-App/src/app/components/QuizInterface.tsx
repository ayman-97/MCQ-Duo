"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { getQuestion, Question } from "@/lib/quizLoader";
import {
  calculateAccuracy,
  calculateStars,
} from "@/lib/calculations";
import { feedback } from "@/lib/audioUtils";
import { ProgressBar, BlurredContent, OptionCard, ExplanationPanel } from "./UIComponents";

interface QuizInterfaceProps {
  subject: string;
  levelIndex: number;
  questions: Question[];
  onComplete: (stats: { accuracy: number; xpEarned: number }) => void;
  onExit: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  subject,
  levelIndex,
  questions,
  onComplete,
  onExit,
}) => {
  const { currentQuestion, recordAnswer, currentAnswers, nextQuestion } = useGameStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [language, setLanguage] = useState<"en" | "ar">("en");

  const question = questions[currentQuestion];
  const isCorrect =
    selectedAnswer === question?.correctAnswer;
  const canAnswer = readingTime >= 1.5;

  useEffect(() => {
    // Reset state for new question
    setSelectedAnswer(null);
    setAnswered(false);
    setShowExplanation(false);
    setReadingTime(0);
  }, [currentQuestion]);

  useEffect(() => {
    // Reading time timer
    const timer = setInterval(() => {
      setReadingTime((t) => Math.min(t + 0.1, 2));
    }, 100);
    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    if (answered || !canAnswer) return;

    setSelectedAnswer(answer);
    recordAnswer(currentQuestion, answer);
    setAnswered(true);

    if (answer === question.correctAnswer) {
      feedback.correctAnswer();
    } else {
      feedback.wrongAnswer();
    }

    // Removed auto-advance so user can read explanations
  };

  const handleLevelComplete = () => {
    const correct = currentAnswers.filter(
      (answer, idx) => answer === questions[idx]?.correctAnswer
    ).length;
    const accuracy = calculateAccuracy(correct, questions.length);
    const xpEarned = 100 + Math.floor((accuracy / 100) * 50);

    onComplete({ accuracy, xpEarned });
  };

  if (!question) {
    return (
      <div className="text-center py-8">
        <p className="text-white">Loading question...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onExit}
          className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition"
        >
          ← Back
        </button>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Level {levelIndex + 1}</p>
          <p className="text-white font-bold">
            Question {currentQuestion + 1}/{questions.length}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Subject</p>
          <p className="text-blue-400 font-bold">{subject}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        current={currentQuestion + 1}
        total={questions.length}
        duration={1.5}
      />

      {/* Question Section */}
      <motion.div className="bg-dark-800 rounded-lg p-6 mb-6 flex-1">
        {/* Question with language toggle */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white flex-1 leading-tight">
              {language === "en" ? question.question.en : (question.question.ar || question.question.en)}
            </h2>
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition whitespace-nowrap"
              title="Toggle language"
            >
              {language === "en" ? "عربي" : "English"}
            </button>
          </div>
          <p className="text-gray-400 text-sm italic">
            {language === "en" ? (question.question.ar || question.question.en) : question.question.en}
          </p>
        </div>

        {/* Reading Time Progress */}
        <div className="mb-6">
          <div className="w-full bg-dark-700 rounded-full h-1 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
              animate={{ width: `${Math.min((readingTime / 1.5) * 100, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {canAnswer ? "✓ Ready to answer" : "Reading..."}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => {
            let state: "default" | "correct" | "wrong" = "default";
            if (answered) {
              if (option.letter === question.correctAnswer) {
                state = "correct";
              } else if (option.letter === selectedAnswer) {
                state = "wrong";
              }
            }

            return (
              <OptionCard
                key={option.letter}
                letter={option.letter}
                text={option.text}
                selected={selectedAnswer === option.letter}
                state={state}
                onClick={() => handleAnswer(option.letter)}
                disabled={answered}
                blurred={!canAnswer}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Explanation Panel and Next */}
      {answered && (
        <motion.div
          className="bg-dark-800 rounded-lg p-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full text-left px-4 py-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition flex justify-between items-center mb-4"
          >
            <span>
              <span className="text-blue-400 font-semibold">
                {isCorrect ? "✓ Correct!" : "✗ Incorrect"}{" "}
              </span>
              <span className="text-gray-400">- See explanation</span>
            </span>
            <span className="text-gray-400">
              {showExplanation ? "▲" : "▼"}
            </span>
          </button>
          
          <button
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                nextQuestion();
              } else {
                handleLevelComplete();
              }
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition"
          >
            {currentQuestion < questions.length - 1 ? "Next Question →" : "Finish Level"}
          </button>
        </motion.div>
      )}

      <ExplanationPanel
        visible={showExplanation && answered}
        title={`Explanation ${language === "ar" ? "(عربي)" : "(English)"}`}
        content={language === "en" ? (question.explanation.en || "No explanation available.") : (question.explanation.ar || question.explanation.en || "لا يوجد شرح متوفر.")}
        onClose={() => setShowExplanation(false)}
      />
    </div>
  );
};
