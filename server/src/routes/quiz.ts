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

const router = express.Router();

router.post('/upload', protect, upload.single('pdf'), uploadPDF);
router.post('/generate', protect, generateQuiz);
router.get('/history', protect, getQuizHistory);
router.get('/:id', protect, getQuiz);
router.delete('/:id', protect, deleteQuiz);

export default router;
