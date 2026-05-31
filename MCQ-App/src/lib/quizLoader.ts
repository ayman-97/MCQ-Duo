// Utility to load quiz data from db.json
import dbData from "@/data/db.json"; // Force reload 6

export interface Question {
  id: string;
  question: { en: string; ar: string };
  options: Array<{ letter: string; text: string }>;
  correctAnswer: string;
  explanation: { en: string; ar: string };
}

export interface Subject {
  name: string;
  levels: Question[][];
}

export const loadQuizData = (): { [subject: string]: Question[][] } => {
  return dbData.subjects || {};
};

export const getSubjects = (): string[] => {
  const data = loadQuizData();
  return Object.keys(data).sort();
};

export const getSubjectLevels = (subject: string): Question[][] => {
  const data = loadQuizData();
  return data[subject] || [];
};

export const getLevel = (subject: string, levelIndex: number): Question[] => {
  const data = loadQuizData();
  return data[subject]?.[levelIndex] || [];
};

export const getQuestion = (
  subject: string,
  levelIndex: number,
  questionIndex: number
): Question | null => {
  const level = getLevel(subject, levelIndex);
  return level[questionIndex] || null;
};
