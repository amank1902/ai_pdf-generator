export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  _id: string;
  userId: string;
  title: string;
  pdfName: string;
  questions: Question[];
  totalQuestions: number;
  createdAt: string;
}

export interface Answer {
  questionIndex: number;
  selectedAnswer: number;
  timeTaken?: number;
  isCorrect?: boolean;
}

export interface TopicPerformance {
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
}

export interface QuizResult {
  _id: string;
  quizId: Quiz | string;
  userId: string;
  answers: Answer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  timeTaken: number;
  topicPerformance: TopicPerformance[];
  attemptedAt: string;
}

export interface DashboardAnalytics {
  totalQuizzes: number;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
  recentQuizzes: QuizResult[];
  strongTopics: TopicPerformance[];
  weakTopics: TopicPerformance[];
  dailyStreak: number;
  performanceHistory: {
    date: string;
    score: number;
    accuracy: number;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
