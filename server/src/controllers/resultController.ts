import { Request, Response } from 'express';
import QuizResult from '../models/QuizResult';
import Quiz from '../models/Quiz';
import { ITopicPerformance } from '../models/QuizResult';

// @desc    Submit quiz answers
// @route   POST /api/quiz/submit
// @access  Private
export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Quiz ID and answers are required'
      });
    }

    // Get quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user owns the quiz
    if (quiz.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this quiz'
      });
    }

    // Calculate results
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer: any, index: number) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeTaken: answer.timeTaken || 0
      };
    });

    const totalQuestions = quiz.totalQuestions;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const score = accuracy;

    // Calculate topic-wise performance
    const topicMap = new Map<string, { correct: number; total: number }>();
    
    processedAnswers.forEach((answer, index) => {
      const question = quiz.questions[index];
      const topic = question.topic;
      
      if (!topicMap.has(topic)) {
        topicMap.set(topic, { correct: 0, total: 0 });
      }
      
      const topicData = topicMap.get(topic)!;
      topicData.total++;
      if (answer.isCorrect) {
        topicData.correct++;
      }
    });

    const topicPerformance: ITopicPerformance[] = Array.from(topicMap.entries()).map(([topic, data]) => ({
      topic,
      correct: data.correct,
      total: data.total,
      accuracy: Math.round((data.correct / data.total) * 100)
    }));

    // Save result
    const result = await QuizResult.create({
      quizId,
      userId: req.user.id,
      answers: processedAnswers,
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      timeTaken: timeTaken || 0,
      topicPerformance
    });

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        resultId: result._id,
        score,
        correctAnswers,
        incorrectAnswers,
        accuracy,
        topicPerformance
      }
    });
  } catch (error: any) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting quiz'
    });
  }
};

// @desc    Get quiz result by ID
// @route   GET /api/quiz/result/:id
// @access  Private
export const getQuizResult = async (req: Request, res: Response) => {
  try {
    const result = await QuizResult.findById(req.params.id)
      .populate('quizId', 'title questions');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Check if user owns the result
    if (result.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this result'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Get result error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching result'
    });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Get all results for user
    const results = await QuizResult.find({ userId }).sort({ attemptedAt: -1 });

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalQuizzes: 0,
          averageScore: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          recentQuizzes: [],
          strongTopics: [],
          weakTopics: [],
          dailyStreak: 0,
          performanceHistory: []
        }
      });
    }

    // Calculate statistics
    const totalQuizzes = results.length;
    const averageScore = Math.round(
      results.reduce((acc, r) => acc + r.score, 0) / totalQuizzes
    );
    const totalQuestions = results.reduce((acc, r) => acc + r.totalQuestions, 0);
    const correctAnswers = results.reduce((acc, r) => acc + r.correctAnswers, 0);

    // Get recent quizzes
    const recentQuizzes = await QuizResult.find({ userId })
      .sort({ attemptedAt: -1 })
      .limit(5)
      .populate('quizId', 'title');

    // Calculate topic performance across all quizzes
    const topicMap = new Map<string, { correct: number; total: number }>();
    
    results.forEach(result => {
      result.topicPerformance.forEach(tp => {
        if (!topicMap.has(tp.topic)) {
          topicMap.set(tp.topic, { correct: 0, total: 0 });
        }
        const data = topicMap.get(tp.topic)!;
        data.correct += tp.correct;
        data.total += tp.total;
      });
    });

    const topicPerformance = Array.from(topicMap.entries())
      .map(([topic, data]) => ({
        topic,
        accuracy: Math.round((data.correct / data.total) * 100),
        correct: data.correct,
        total: data.total
      }))
      .sort((a, b) => b.accuracy - a.accuracy);

    const strongTopics = topicPerformance.slice(0, 5);
    const weakTopics = topicPerformance.slice(-5).reverse();

    // Calculate daily streak
    let dailyStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedResults = results.sort((a, b) => 
      new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
    );

    for (let i = 0; i < sortedResults.length; i++) {
      const resultDate = new Date(sortedResults[i].attemptedAt);
      resultDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        dailyStreak++;
      } else {
        break;
      }
    }

    // Performance history (last 7 days)
    const performanceHistory = results.slice(0, 7).reverse().map(r => ({
      date: r.attemptedAt,
      score: r.score,
      accuracy: r.accuracy
    }));

    res.status(200).json({
      success: true,
      data: {
        totalQuizzes,
        averageScore,
        totalQuestions,
        correctAnswers,
        recentQuizzes,
        strongTopics,
        weakTopics,
        dailyStreak,
        performanceHistory
      }
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching analytics'
    });
  }
};
