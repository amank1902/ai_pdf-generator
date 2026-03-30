import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

export interface ITopicPerformance {
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
}

export interface IQuizResult extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  timeTaken: number;
  topicPerformance: ITopicPerformance[];
  attemptedAt: Date;
}

const answerSchema = new Schema<IAnswer>({
  questionIndex: {
    type: Number,
    required: true
  },
  selectedAnswer: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeTaken: {
    type: Number,
    default: 0
  }
}, { _id: false });

const topicPerformanceSchema = new Schema<ITopicPerformance>({
  topic: {
    type: String,
    required: true
  },
  correct: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  }
}, { _id: false });

const quizResultSchema = new Schema<IQuizResult>({
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: {
    type: [answerSchema],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  incorrectAnswers: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeTaken: {
    type: Number,
    required: true,
    default: 0
  },
  topicPerformance: {
    type: [topicPerformanceSchema],
    default: []
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IQuizResult>('QuizResult', quizResultSchema);
