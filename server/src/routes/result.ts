import express from 'express';
import { submitQuiz, getQuizResult } from '../controllers/resultController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/submit', protect, submitQuiz);
router.get('/:id', protect, getQuizResult);

export default router;
