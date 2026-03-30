import express from 'express';
import { getDashboardAnalytics } from '../controllers/resultController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', protect, getDashboardAnalytics);

export default router;
