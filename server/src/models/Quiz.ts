import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface IQuiz extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  pdfName: string;
  pdfPath: string;
  questions: IQuestion[];
  totalQuestions: number;
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 4, 'Must have exactly 4 options']
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  }
}, { _id: false });

const quizSchema = new Schema<IQuiz>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  pdfName: {
    type: String,
    required: true
  },
  pdfPath: {
    type: String,
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: [(val: IQuestion[]) => val.length > 0, 'Quiz must have at least one question']
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IQuiz>('Quiz', quizSchema);
