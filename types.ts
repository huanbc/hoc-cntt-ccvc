// FIX: Import ComponentType from React to resolve reference error.
import type { ComponentType } from 'react';

export interface Topic {
  name: string;
  icon: ComponentType<{ className?: string }>;
  lessons?: string[]; // Optional array of lesson titles
}

export interface Category {
  name: string;
  topics: Topic[];
}

export type Level = 'Cơ bản' | 'Nâng cao' | 'Chuyên gia' | 'Chuẩn kỹ năng';

// Add types for Quiz functionality
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type QuizData = QuizQuestion[];
