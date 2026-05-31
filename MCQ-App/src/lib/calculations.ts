// Calculation utilities
export const calculateAccuracy = (
  correct: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

export const calculateXP = (
  accuracy: number,
  questionCount: number = 10
): number => {
  const baseXP = 100;
  const accuracyMultiplier = accuracy / 100;
  return Math.round(baseXP * accuracyMultiplier * (questionCount / 10));
};

export const calculateStars = (accuracy: number): number => {
  if (accuracy >= 90) return 3;
  if (accuracy >= 70) return 2;
  if (accuracy >= 50) return 1;
  return 0;
};

export const getLevelColor = (
  state: "locked" | "current" | "completed"
): string => {
  switch (state) {
    case "locked":
      return "text-dark-700";
    case "current":
      return "text-neon-blue";
    case "completed":
      return "text-neon-green";
    default:
      return "text-gray-500";
  }
};

export const getLevelGlowColor = (
  state: "locked" | "current" | "completed"
): string => {
  switch (state) {
    case "locked":
      return "shadow-none";
    case "current":
      return "shadow-lg shadow-blue-500/50";
    case "completed":
      return "shadow-lg shadow-green-500/50";
    default:
      return "shadow-none";
  }
};
