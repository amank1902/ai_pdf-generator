import express from 'express';
import {
  uploadPDF,
  generateQuiz,
  getQuiz,
  getQuizHistory,
  deleteQuiz
} from '../controllers/quizController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';
import { uploadLimiter, quizGenerationLimiter } from '../middleware/rateLimiter';
import { quizGenerationValidation, mongoIdValidation } from '../middleware/validators';

const router = express.Router();

router.post('/upload', protect, uploadLimiter, upload.single('pdf'), uploadPDF);
router.post('/generate', protect, quizGenerationLimiter, quizGenerationValidation, generateQuiz);
router.get('/history', protect, getQuizHistory);
router.get('/:id', protect, mongoIdValidation, getQuiz);
router.delete('/:id', protect, mongoIdValidation, deleteQuiz);

export default router;
