"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  duration?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  duration = 1.5,
}) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden mb-4">
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration, ease: "easeInOut" }}
      />
    </div>
  );
};

interface BlurredContentProps {
  visible: boolean;
  children: React.ReactNode;
  delay?: number;
}

export const BlurredContent: React.FC<BlurredContentProps> = ({
  visible,
  children,
  delay = 1.5,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!visible) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [visible, delay]);

  return (
    <motion.div
      initial={{ filter: "blur(8px)", opacity: 0.5 }}
      animate={
        isVisible
          ? { filter: "blur(0px)", opacity: 1 }
          : { filter: "blur(8px)", opacity: 0.5 }
      }
      transition={{ duration: 0.3 }}
      className="pointer-events-none"
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {children}
    </motion.div>
  );
};

interface OptionCardProps {
  letter: string;
  text: string;
  selected: boolean;
  state: "default" | "correct" | "wrong";
  onClick: () => void;
  disabled: boolean;
  blurred: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  letter,
  text,
  selected,
  state,
  onClick,
  disabled,
  blurred,
}) => {
  let bgColor = "bg-dark-800";
  let borderColor = "border-dark-700";
  let textColor = "text-white";

  if (state === "correct") {
    bgColor = "bg-green-600";
    textColor = "text-white";
  } else if (state === "wrong") {
    bgColor = "bg-red-600";
    textColor = "text-white";
  } else if (selected) {
    bgColor = "bg-blue-600";
    borderColor = "border-blue-500";
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || blurred}
      className={`
        w-full p-4 mb-3 text-start rounded-lg border-2 transition-all
        ${bgColor} ${borderColor} ${textColor}
        ${disabled || blurred ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
        flex items-start gap-3
      `}
      whileHover={!disabled && !blurred ? { scale: 1.02, x: 4 } : {}}
      whileTap={!disabled && !blurred ? { scale: 0.98 } : {}}
      animate={
        state === "wrong"
          ? { x: [-2, 2, -2, 2, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.4 }}
    >
      <span className="font-bold text-lg min-w-fit">{letter}.</span>
      <span className="flex-1">{text}</span>
    </motion.button>
  );
};

interface ExplanationPanelProps {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  visible,
  title,
  content,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50"
          onClick={onClose}
        >
          <motion.div
            className="w-full bg-dark-800 rounded-t-2xl p-6 border-t border-dark-700"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            onClick={(e) => e.stopPropagation()}
            dir={content.match(/[\u0600-\u06FF]/) ? "rtl" : "ltr"}
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-400">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-dark-700 transition"
              >
                ✕
              </button>
            </div>
            <p className="text-white leading-relaxed text-start">{content}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
