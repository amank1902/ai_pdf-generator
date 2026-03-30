'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { quizService } from '@/services/quiz';
import { resultService } from '@/services/result';
import { LoadingScreen } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send 
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTimer } from '@/hooks/useTimer';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;
  const { isAuthenticated } = useAuthStore();
  const {
    currentQuestionIndex,
    answers,
    setCurrentQuestion,
    setAnswer,
    startQuiz,
    resetQuiz,
    getAnswersArray,
  } = useQuizStore();

  const { seconds, formatTime } = useTimer(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      startQuiz();
    }
    return () => resetQuiz();
  }, [isAuthenticated, router]);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const response = await quizService.getQuiz(quizId);
      return response.data;
    },
    enabled: !!quizId && isAuthenticated,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const answersArray = getAnswersArray();
      return await resultService.submitQuiz(quizId, answersArray, seconds);
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success('Quiz submitted successfully!');
        router.push(`/results/${response.data.resultId}`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    },
  });

  if (isLoading || !quiz) {
    return <LoadingScreen message="Loading quiz..." />;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.totalQuestions;
  const answeredCount = answers.size;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswer(currentQuestionIndex, optionIndex);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestion(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      setShowConfirm(true);
    } else {
      submitMutation.mutate();
    }
  };

  const confirmSubmit = () => {
    submitMutation.mutate();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500 bg-green-500/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/20';
      case 'hard':
        return 'text-red-500 bg-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Exit Quiz</span>
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-sm md:text-lg font-bold truncate">{quiz.title}</h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Q {currentQuestionIndex + 1}/{totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-2 md:px-4 py-1.5 md:py-2 bg-gray-100 dark:bg-background rounded-lg border border-gray-300 dark:border-gray-800">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                <span className="font-mono font-medium text-xs md:text-sm">{formatTime()}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-sm font-medium">
                {answeredCount}/{totalQuestions} answered
              </span>
            </div>
            <Progress value={progress} />
          </motion.div>

          {/* Main Content - Question and Navigation Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question Card - Takes 2 columns */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium">
                            Q{currentQuestionIndex + 1}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${getDifficultyColor(currentQuestion.difficulty)}`}>
                            {currentQuestion.difficulty}
                          </span>
                          <span className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                            {currentQuestion.topic}
                          </span>
                        </div>
                        <h2 className="text-xl font-medium leading-relaxed">
                          {currentQuestion.question}
                        </h2>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = answers.get(currentQuestionIndex) === index;
                        return (
                          <motion.button
                            key={index}
                            onClick={() => handleSelectAnswer(index)}
                            className={`
                              w-full p-4 rounded-xl text-left transition-all duration-200
                              border-2 flex items-center space-x-3
                              ${isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 bg-white dark:bg-background'
                              }
                            `}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div
                              className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                ${isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-gray-400 dark:border-gray-600'
                                }
                              `}
                            >
                              {isSelected && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className={isSelected ? 'font-medium' : ''}>
                              {option}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {currentQuestionIndex === totalQuestions - 1 ? (
                      <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={submitMutation.isPending}
                        isLoading={submitMutation.isPending}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleNext}>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Question Navigator - Sticky on the right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24">
                <Card>
                  <h3 className="text-sm font-medium mb-3 text-gray-500 dark:text-gray-400">Quick Navigation</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {quiz.questions.map((_, index) => {
                      const isAnswered = answers.has(index);
                      const isCurrent = index === currentQuestionIndex;
                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentQuestion(index)}
                          className={`
                            aspect-square rounded-lg font-medium text-sm transition-all
                            ${isCurrent
                              ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-background'
                              : isAnswered
                              ? 'bg-green-500/20 text-green-600 dark:text-green-500 border border-green-500/30'
                              : 'bg-gray-100 dark:bg-background border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-700'
                            }
                          `}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 max-w-md w-full border border-gray-800"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Submit Quiz?</h3>
                <p className="text-sm text-gray-400">
                  You have {totalQuestions - answeredCount} unanswered questions
                </p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Are you sure you want to submit? Unanswered questions will be marked as incorrect.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
              >
                Continue Quiz
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={confirmSubmit}
                isLoading={submitMutation.isPending}
              >
                Submit Anyway
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
