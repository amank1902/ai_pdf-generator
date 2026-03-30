import apiClient from './api';
import { Quiz, ApiResponse } from '@/types';

export const quizService = {
  uploadPDF: async (file: File, onProgress?: (progress: number) => void): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await apiClient.post<ApiResponse>('/api/quiz/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(progress);
        }
      },
    });
    return response.data;
  },

  generateQuiz: async (filename: string, title?: string): Promise<ApiResponse<Quiz>> => {
    const response = await apiClient.post<ApiResponse<Quiz>>('/api/quiz/generate', {
      filename,
      title,
    });
    return response.data;
  },

  getQuiz: async (id: string): Promise<ApiResponse<Quiz>> => {
    const response = await apiClient.get<ApiResponse<Quiz>>(`/api/quiz/${id}`);
    return response.data;
  },

  getQuizHistory: async (): Promise<ApiResponse<Quiz[]>> => {
    const response = await apiClient.get<ApiResponse<Quiz[]>>('/api/quiz/history');
    return response.data;
  },

  deleteQuiz: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/api/quiz/${id}`);
    return response.data;
  },
};
