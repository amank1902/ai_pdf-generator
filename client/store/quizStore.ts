import { create } from 'zustand';
import { Answer } from '@/types';

interface QuizState {
  currentQuestionIndex: number;
  answers: Map<number, number>;
  startTime: number | null;
  timeElapsed: number;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionIndex: number, answerIndex: number) => void;
  startQuiz: () => void;
  resetQuiz: () => void;
  getAnswersArray: () => Answer[];
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuestionIndex: 0,
  answers: new Map(),
  startTime: null,
  timeElapsed: 0,
  
  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  
  setAnswer: (questionIndex, answerIndex) =>
    set((state) => {
      const newAnswers = new Map(state.answers);
      newAnswers.set(questionIndex, answerIndex);
      return { answers: newAnswers };
    }),
  
  startQuiz: () => set({ startTime: Date.now() }),
  
  resetQuiz: () =>
    set({
      currentQuestionIndex: 0,
      answers: new Map(),
      startTime: null,
      timeElapsed: 0,
    }),
  
  getAnswersArray: () => {
    const state = get();
    const answersArray: Answer[] = [];
    state.answers.forEach((selectedAnswer, questionIndex) => {
      answersArray.push({
        questionIndex,
        selectedAnswer,
        timeTaken: 0,
      });
    });
    return answersArray;
  },
}));
