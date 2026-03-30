import { Request, Response } from 'express';
import Quiz from '../models/Quiz';
import { extractTextFromPDF } from '../services/pdfParser';
import { generateQuizFromText } from '../services/geminiService';
import path from 'path';
import fs from 'fs';

// @desc    Upload PDF file
// @route   POST /api/quiz/upload
// @access  Private
export const uploadPDF = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    const file = req.file;

    // Validate file type
    if (file.mimetype !== 'application/pdf') {
      // Delete uploaded file
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size
      }
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading file'
    });
  }
};

// @desc    Generate quiz from PDF
// @route   POST /api/quiz/generate
// @access  Private
export const generateQuiz = async (req: Request, res: Response) => {
  try {
    const { filename, title } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(filePath);

    if (!extractedText || extractedText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract sufficient text from PDF. Please ensure the PDF contains readable text.'
      });
    }

    // Generate quiz using Gemini API
    const questions = await generateQuizFromText(extractedText);

    if (!questions || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Could not generate questions from the content. Please try a different PDF.'
      });
    }

    // Create quiz in database
    const quiz = await Quiz.create({
      userId: req.user.id,
      title: title || `Quiz from ${filename}`,
      pdfName: filename,
      pdfPath: filePath,
      questions,
      totalQuestions: questions.length
    });

    res.status(201).json({
      success: true,
      message: 'Quiz generated successfully',
      data: {
        quizId: quiz._id,
        title: quiz.title,
        totalQuestions: quiz.totalQuestions,
        questions: quiz.questions
      }
    });
  } catch (error: any) {
    console.error('Generate quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating quiz'
    });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quiz/:id
// @access  Private
export const getQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

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
        message: 'Not authorized to access this quiz'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error: any) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching quiz'
    });
  }
};

// @desc    Get user's quiz history
// @route   GET /api/quiz/history
// @access  Private
export const getQuizHistory = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-questions');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error: any) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching quiz history'
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quiz/:id
// @access  Private
export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

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
        message: 'Not authorized to delete this quiz'
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting quiz'
    });
  }
};
