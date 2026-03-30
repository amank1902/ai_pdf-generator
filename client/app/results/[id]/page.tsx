'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { resultService } from '@/services/result';
import { LoadingScreen } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const resultId = params.id as string;
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data: result, isLoading } = useQuery({
    queryKey: ['result', resultId],
    queryFn: async () => {
      const response = await resultService.getQuizResult(resultId);
      return response.data;
    },
    enabled: !!resultId && isAuthenticated,
  });

  if (isLoading || !result) {
    return <LoadingScreen message="Loading results..." />;
  }

  const quiz = result.quizId as any;
  const pieData = [
    { name: 'Correct', value: result.correctAnswers, color: '#10b981' },
    { name: 'Incorrect', value: result.incorrectAnswers, color: '#ef4444' },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return { text: 'Outstanding! 🎉', color: 'text-green-500' };
    if (score >= 75) return { text: 'Great Job! 👏', color: 'text-blue-500' };
    if (score >= 60) return { text: 'Good Effort! 💪', color: 'text-yellow-500' };
    return { text: 'Keep Practicing! 📚', color: 'text-orange-500' };
  };

  const scoreMessage = getScoreMessage(result.score);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-card/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                <Trophy className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-base md:text-xl font-bold">Quiz Results</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="text-center bg-gradient-to-br from-white to-gray-100 dark:from-card dark:to-gray-900 border-2 border-primary/30">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${scoreMessage.color}`}>
                {scoreMessage.text}
              </h2>
              <div className="mb-4">
                <div className="text-6xl font-bold gradient-text mb-2">
                  {result.score}%
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  {result.correctAnswers} out of {result.totalQuestions} correct
                </p>
              </div>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>{formatTime(result.timeTaken)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>{result.accuracy}% accuracy</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {/* Performance Chart */}
            <Card>
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Performance Overview
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Topic Performance */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Topic-Wise Performance</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {result.topicPerformance.map((topic: any, index: number) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate flex-1">
                        {topic.topic}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {topic.correct}/{topic.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          topic.accuracy >= 75
                            ? 'bg-green-500'
                            : topic.accuracy >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${topic.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Question Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h3 className="text-xl font-bold mb-6">Answer Review</h3>
              <div className="space-y-6">
                {quiz.questions.map((question: any, index: number) => {
                  const userAnswer = result.answers.find((a: any) => a.questionIndex === index);
                  const isCorrect = userAnswer?.isCorrect;
                  const selectedIndex = userAnswer?.selectedAnswer;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 ${
                        isCorrect
                          ? 'border-green-500/30 bg-green-500/5'
                          : 'border-red-500/30 bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-medium">
                              Q{index + 1}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                              {question.topic}
                            </span>
                          </div>
                          <p className="font-medium mb-3">{question.question}</p>

                          <div className="space-y-2">
                            {question.options.map((option: string, optIndex: number) => {
                              const isUserAnswer = selectedIndex === optIndex;
                              const isCorrectAnswer = question.correctAnswer === optIndex;

                              return (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded-lg text-sm ${
                                    isCorrectAnswer
                                      ? 'bg-green-500/20 border border-green-500/30 font-medium'
                                      : isUserAnswer && !isCorrect
                                      ? 'bg-red-500/20 border border-red-500/30'
                                      : 'bg-gray-50 dark:bg-background border border-gray-200 dark:border-gray-800'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {isCorrectAnswer && (
                                      <span className="text-green-500 text-xs font-medium">
                                        ✓ Correct
                                      </span>
                                    )}
                                    {isUserAnswer && !isCorrect && (
                                      <span className="text-red-500 text-xs font-medium">
                                        Your answer
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-3 p-3 bg-gray-50 dark:bg-background rounded-lg border border-gray-200 dark:border-gray-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-gray-900 dark:text-foreground">Explanation:</span>{' '}
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center space-x-4 mt-8"
          >
            <Link href="/dashboard">
              <Button variant="primary" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/upload">
              <Button variant="outline" size="lg">
                Take Another Quiz
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
