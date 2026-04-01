# 🎓 AI Mock Test Generator

A modern, full-stack AI-powered quiz generation platform where users upload PDF study materials and receive auto-generated MCQ quizzes using Google's Gemini 2.0 Flash API.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)
![Gemini](https://img.shields.io/badge/Gemini-2.0%20Flash-orange)

## ✨ Features

- 🔐 **Authentication** - Secure JWT-based signup/login system
- 📄 **PDF Upload** - Drag-and-drop PDF upload with progress tracking
- 🤖 **AI Quiz Generation** - Powered by Gemini 2.0 Flash API
- ⏱️ **Timed Quizzes** - Real-time timer with question navigation
- 📊 **Analytics Dashboard** - Comprehensive performance tracking
- 📈 **Topic Performance** - Track strengths and weaknesses by topic
- 🎨 **Modern UI** - Dark theme with smooth animations
- 📱 **Responsive Design** - Works perfectly on all devices

## 🚀 Quick Start

### Installation

See detailed instructions in [SETUP_GUIDE.md](./SETUP_GUIDE.md)

**Quick Steps:**
1. Install dependencies: `cd server && npm install` and `cd client && npm install`
2. Configure `.env` files (see SETUP_GUIDE.md)
3. Start MongoDB: `net start MongoDB`
4. Run server: `cd server && npm run dev`
5. Run client: `cd client && npm run dev`
6. Open: `http://localhost:3000`

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Charts:** Recharts
- **UI Components:** Custom components with Radix-like patterns

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **PDF Processing:** pdf-parse
- **AI:** Google Gemini 2.0 Flash API
- **File Upload:** Multer

## 📁 Project Structure

```
ai_generator_pdf/
│
├── client/                     # Frontend (Next.js)
│   ├── app/
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   ├── dashboard/         # Main dashboard
│   │   ├── upload/            # PDF upload page
│   │   ├── quiz/[id]/         # Quiz attempt page
│   │   └── results/[id]/      # Results & analytics
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── auth/              # Auth components
│   │   ├── dashboard/         # Dashboard components
│   │   └── quiz/              # Quiz components
│   ├── services/              # API service layer
│   ├── store/                 # Zustand state stores
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript type definitions
│
├── server/                     # Backend (Express)
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & upload middleware
│   │   ├── services/          # Business logic
│   │   │   ├── pdfParser.ts   # PDF text extraction
│   │   │   └── geminiService.ts # AI quiz generation
│   │   └── utils/             # Helper functions
│   └── uploads/               # PDF file storage
│
├── SETUP_GUIDE.md            # Detailed setup instructions
└── README.md                 # This file
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      Register new user
POST   /api/auth/login         Login user
GET    /api/auth/me            Get current user
```

### Quiz Management
```
POST   /api/quiz/upload        Upload PDF file
POST   /api/quiz/generate      Generate quiz from PDF
GET    /api/quiz/:id           Get quiz by ID
GET    /api/quiz/history       Get user's quiz history
DELETE /api/quiz/:id           Delete quiz
```

### Results & Analytics
```
POST   /api/result/submit      Submit quiz answers
GET    /api/result/:id         Get quiz result details
GET    /api/analytics/dashboard Get dashboard analytics
```

## 🎯 User Flow

1. **Sign Up/Login** → Create account or login
2. **Upload PDF** → Upload study material (max 10MB)
3. **AI Processing** → Gemini generates 10 MCQs with explanations
4. **Attempt Quiz** → Answer questions with timer
5. **View Results** → See score, topic performance, and detailed explanations
6. **Dashboard** → Track progress, streaks, and analytics

## 🎨 UI Screenshots

### Key Features
- ✅ Gradient backgrounds with glassmorphism effects
- ✅ Smooth page transitions and micro-interactions
- ✅ Dark theme with purple/blue accent colors
- ✅ Responsive grid layouts
- ✅ Interactive charts and visualizations
- ✅ Progress indicators and loading states

## 🔒 Security

- 🔐 Password hashing with bcrypt
- 🎫 JWT tokens for authentication
- 🛡️ Protected API routes
- ✅ File type validation (PDF only)
- 📏 File size limits (10MB max)
- 🚫 Input sanitization

## 📦 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-quiz-generator
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Client (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

See [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting) for common issues and solutions.

