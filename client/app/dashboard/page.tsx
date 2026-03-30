'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { resultService } from '@/services/result';
import { LoadingScreen } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { 
  LayoutDashboard, 
  Upload, 
  TrendingUp, 
  Target, 
  Award,
  Clock,
  LogOut,
  User,
  Flame
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await resultService.getDashboardAnalytics();
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (isLoading || !isAuthenticated) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                <LayoutDashboard className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base md:text-xl font-bold truncate">AI Mock Test Generator</h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate hidden sm:block">Welcome back, {user?.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
              <ThemeToggle />
              <Link href="/upload" className="hidden sm:block">
                <Button variant="primary" size="sm">
                  <Upload className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Upload PDF</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:flex">
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
              {/* Mobile Menu Button */}
              <div className="sm:hidden flex gap-1">
                <Link href="/upload">
                  <Button variant="primary" size="sm">
                    <Upload className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8"
        >
          <Card className="border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Total Quizzes</p>
                <p className="text-2xl md:text-3xl font-bold mt-1">{data?.totalQuizzes || 0}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Average Score</p>
                <p className="text-2xl md:text-3xl font-bold mt-1">{data?.averageScore || 0}%</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Correct Answers</p>
                <p className="text-2xl md:text-3xl font-bold mt-1">{data?.correctAnswers || 0}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">Daily Streak</p>
                <p className="text-2xl md:text-3xl font-bold mt-1">{data?.dailyStreak || 0} days</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Flame className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary" />
                Recent Quizzes
              </h2>
              {data?.recentQuizzes && data.recentQuizzes.length > 0 ? (
                <div className="space-y-3">
                  {data.recentQuizzes.map((quiz: any) => (
                    <div
                      key={quiz._id}
                      className="p-3 md:p-4 bg-gray-50 dark:bg-background rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm md:text-base truncate">{quiz.quizId?.title || 'Quiz'}</h3>
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            {new Date(quiz.attemptedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl md:text-2xl font-bold text-primary">{quiz.score}%</p>
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            {quiz.correctAnswers}/{quiz.totalQuestions}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-4">No quizzes attempted yet</p>
                  <Link href="/upload">
                    <Button variant="primary" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Create Your First Quiz
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Topic Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h2 className="text-xl font-bold mb-4">Strong Topics</h2>
              {data?.strongTopics && data.strongTopics.length > 0 ? (
                <div className="space-y-3">
                  {data.strongTopics.slice(0, 5).map((topic: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">{topic.topic}</span>
                      <span className="text-green-500 font-medium ml-2">{topic.accuracy}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No data available</p>
              )}

              <h2 className="text-xl font-bold mt-6 mb-4">Weak Topics</h2>
              {data?.weakTopics && data.weakTopics.length > 0 ? (
                <div className="space-y-3">
                  {data.weakTopics.slice(0, 5).map((topic: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">{topic.topic}</span>
                      <span className="text-red-500 font-medium ml-2">{topic.accuracy}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No data available</p>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
