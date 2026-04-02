import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Validation rules for quiz generation
 */
export const quizGenerationValidation = [
  body('filename')
    .trim()
    .notEmpty()
    .withMessage('Filename is required')
    .isLength({ max: 255 })
    .withMessage('Filename is too long')
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage('Filename contains invalid characters'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  handleValidationErrors
];

/**
 * Validation rules for quiz submission
 */
export const quizSubmissionValidation = [
  body('quizId')
    .notEmpty()
    .withMessage('Quiz ID is required')
    .isMongoId()
    .withMessage('Invalid quiz ID'),
  
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers must be a non-empty array'),
  
  body('answers.*.questionIndex')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Invalid question index'),
  
  body('answers.*.selectedAnswer')
    .isInt({ min: 0, max: 3 })
    .withMessage('Selected answer must be between 0 and 3'),
  
  body('timeTaken')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time taken must be a positive number'),
  
  handleValidationErrors
];

/**
 * Validation rules for MongoDB ID parameters
 */
export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];
