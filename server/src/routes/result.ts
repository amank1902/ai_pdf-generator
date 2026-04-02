import express from 'express';
import { submitQuiz, getQuizResult } from '../controllers/resultController';
import { protect } from '../middleware/auth';
import { quizSubmissionValidation, mongoIdValidation } from '../middleware/validators';

const router = express.Router();

router.post('/submit', protect, quizSubmissionValidation, submitQuiz);
router.get('/:id', protect, mongoIdValidation, getQuizResult);

export default router;
