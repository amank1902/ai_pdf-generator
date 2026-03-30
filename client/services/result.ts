import apiClient from './api';
import { QuizResult, ApiResponse, DashboardAnalytics } from '@/types';
import { Answer } from '@/types';

export const resultService = {
  submitQuiz: async (
    quizId: string,
    answers: Answer[],
    timeTaken: number
  ): Promise<ApiResponse<QuizResult>> => {
    const response = await apiClient.post<ApiResponse<QuizResult>>('/api/result/submit', {
      quizId,
      answers,
      timeTaken,
    });
    return response.data;
  },

  getQuizResult: async (id: string): Promise<ApiResponse<QuizResult>> => {
    const response = await apiClient.get<ApiResponse<QuizResult>>(`/api/result/${id}`);
    return response.data;
  },

  getDashboardAnalytics: async (): Promise<ApiResponse<DashboardAnalytics>> => {
    const response = await apiClient.get<ApiResponse<DashboardAnalytics>>('/api/analytics/dashboard');
    return response.data;
  },
};
