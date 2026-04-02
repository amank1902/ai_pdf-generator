import { GoogleGenerativeAI } from '@google/generative-ai';
import { IQuestion } from '../models/Quiz';
import { sanitizeTextForAI, validateExtractedText } from '../utils/textSanitization';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateQuizFromText = async (text: string): Promise<IQuestion[]> => {
  try {
    // Validate text quality
    const validation = validateExtractedText(text);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Sanitize text to prevent prompt injection
    const sanitizedText = sanitizeTextForAI(text);

    // Limit text length to avoid token limits
    const maxTextLength = 3000;
    const textToProcess = sanitizedText.length > maxTextLength 
      ? sanitizedText.substring(0, maxTextLength) 
      : sanitizedText;

    // Use gemini-1.5-pro model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
    });

    const prompt = `You are an expert quiz generator. Generate 10 multiple choice questions from the provided study material.

IMPORTANT: Return ONLY valid JSON. Do not include any markdown formatting, code blocks, or explanations.

Requirements for each question:
- question: A clear, specific question based on the material
- options: An array of exactly 4 options (strings)
- correctAnswer: The index of the correct option (0-3)
- explanation: A brief explanation of why the answer is correct
- topic: The main topic/subject of the question
- difficulty: Either "easy", "medium", or "hard"

Study Material:
${textToProcess}

Return format (raw JSON only):
[
  {
    "question": "Question text here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0,
    "explanation": "Explanation here",
    "topic": "Topic name",
    "difficulty": "medium"
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    // Clean the response - remove markdown code blocks if present
    let cleanedText = generatedText.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    cleanedText = cleanedText.trim();

    // Parse JSON
    const questions: IQuestion[] = JSON.parse(cleanedText);

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No valid questions generated');
    }

    // Validate each question structure
    const validatedQuestions = questions.filter(q => {
      return (
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 &&
        q.correctAnswer <= 3 &&
        q.explanation &&
        q.topic &&
        ['easy', 'medium', 'hard'].includes(q.difficulty)
      );
    });

    if (validatedQuestions.length === 0) {
      throw new Error('No valid questions after validation');
    }

    return validatedQuestions;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    // If JSON parsing failed, provide more context
    if (error.message.includes('JSON')) {
      throw new Error('Failed to parse AI response. Please try again.');
    }
    
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
};
