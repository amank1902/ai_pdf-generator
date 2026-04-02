import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './utils/db';
import { validateEnv, validateConfig } from './utils/envValidation';

// Load environment variables
dotenv.config();

// Validate environment variables before starting
validateEnv();
validateConfig();

// Import routes
import authRoutes from './routes/auth';
import quizRoutes from './routes/quiz';
import resultRoutes from './routes/result';
import analyticsRoutes from './routes/analytics';

// Initialize express app
const app: Application = express();

// Connect to database
connectDB();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// CORS configuration
import { corsOptionsDev } from './utils/corsConfig';

app.use(cors(corsOptionsDev));
// For production, use: app.use(cors(corsOptions));

// Body parser with size limits (prevent DoS)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/result', resultRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('============================================');
  console.log('  AI Mock Test Generator - Server');
  console.log('============================================');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log('============================================');
  console.log('');
});

export default app;
