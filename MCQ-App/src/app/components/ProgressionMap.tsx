"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

interface ProgressionMapProps {
  subject: string;
  levels: any[];
  onLevelClick: (levelIndex: number) => void;
}

export const ProgressionMap: React.FC<ProgressionMapProps> = ({
  subject,
  levels,
  onLevelClick,
}) => {
  const { getLevelState } = useGameStore();

  const getLevelStatus = (
    levelIndex: number
  ): "locked" | "current" | "completed" => {
    const state = getLevelState(subject, levelIndex);
    if (state.completed) return "completed";
    if (levelIndex === 0 || getLevelState(subject, levelIndex - 1).completed) {
      return "current";
    }
    return "locked";
  };

  // SVG path coordinates for winding progression map
  const nodePositions = levels.map((_, index) => ({
    x: index % 2 === 0 ? 100 : 300,
    y: Math.floor(index / 2) * 120 + 60,
  }));

  // Create SVG path connecting nodes
  let pathData = "M ";
  nodePositions.forEach((pos, i) => {
    if (i === 0) {
      pathData += `${pos.x} ${pos.y}`;
    } else {
      pathData += ` Q ${(nodePositions[i - 1].x + pos.x) / 2} ${
        (nodePositions[i - 1].y + pos.y) / 2 + 40
      } ${pos.x} ${pos.y}`;
    }
  });

  return (
    <div className="relative w-full bg-dark-900 rounded-lg p-4 overflow-y-auto" style={{ height: "600px" }}>
      {/* SVG Background Path */}
      <svg
        className="absolute inset-0 w-full"
        style={{ height: "100%" }}
        viewBox={`0 0 400 ${nodePositions[nodePositions.length - 1]?.y + 100 || 200}`}
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d={pathData}
          stroke="url(#pathGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Level Nodes */}
      <div className="relative z-10">
        {levels.map((level, index) => {
          const status = getLevelStatus(index);
          const levelState = getLevelState(subject, index);
          const pos = nodePositions[index];

          return (
            <motion.button
              key={index}
              onClick={() => status !== "locked" && onLevelClick(index)}
              disabled={status === "locked"}
              className="absolute"
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
              whileHover={status !== "locked" ? { scale: 1.1 } : {}}
              whileTap={status !== "locked" ? { scale: 0.95 } : {}}
            >
              <div
                className={`
                  relative w-20 h-20 rounded-full flex flex-col items-center justify-center
                  font-bold text-lg transition-all duration-300 cursor-pointer
                  ${
                    status === "locked"
                      ? "bg-dark-700 text-dark-500 opacity-50"
                      : status === "current"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 animate-pulse"
                      : "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50"
                  }
                `}
              >
                {/* Level Number */}
                <span className="text-center">{index + 1}</span>

                {/* Stars for completed levels */}
                {status === "completed" && (
                  <div className="flex gap-0.5 text-xs mt-1">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < levelState.stars
                            ? "text-yellow-300"
                            : "text-gray-600"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}

                {/* Lock icon for locked levels */}
                {status === "locked" && (
                  <div className="absolute text-xs mt-8">🔒</div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
