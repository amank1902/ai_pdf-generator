# 🚀 AI Mock Test Generator - Complete Setup Guide

## ✅ Prerequisites

Before you begin, make sure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (Community Edition) - [Download here](https://www.mongodb.com/try/download/community)
3. **Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)

## 📦 Installation Steps

### Step 1: Install Dependencies

Open **TWO** command prompt/terminal windows.

**Terminal 1 - Backend:**
```bash
cd D:\ai_generator_pdf\server
npm install
```

**Terminal 2 - Frontend:**
```bash
cd D:\ai_generator_pdf\client
npm install
```

⏳ This will take a few minutes. Wait for both to complete.

---

### Step 2: Configure Environment Variables

#### Backend Configuration

1. Navigate to `D:\ai_generator_pdf\server\`
2. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
3. Open `.env` and fill in these values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-quiz-generator
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Important:** 
- Get your Gemini API key from: https://makersuite.google.com/app/apikey
- Change `JWT_SECRET` to a random secure string

#### Frontend Configuration

1. Navigate to `D:\ai_generator_pdf\client\`
2. Copy `.env.local.example` to `.env.local`:
   ```bash
   copy .env.local.example .env.local
   ```
3. The file should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

### Step 3: Start MongoDB

You need MongoDB running before starting the server.

**Option 1: MongoDB as a Service (Windows)**
```bash
net start MongoDB
```

**Option 2: Manual Start**
```bash
mongod --dbpath="C:\data\db"
```

If MongoDB is not found, make sure you installed it and added it to your PATH.

---

### Step 4: Run the Application

Keep both terminals open from Step 1.

**Terminal 1 - Start Backend Server:**
```bash
cd D:\ai_generator_pdf\server
npm run dev
```

You should see:
```
✓ MongoDB Connected: localhost
✓ Server running on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
cd D:\ai_generator_pdf\client
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

---

### Step 5: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

🎉 **You're ready to go!**

---

## 🎯 Quick Start Guide

1. **Sign Up** - Create a new account
2. **Upload PDF** - Click "Upload PDF" and select your study material
3. **Generate Quiz** - AI will create questions from your PDF
4. **Take Quiz** - Answer the questions
5. **View Results** - See your score and analytics

---

## 📁 Project Structure

```
ai_generator_pdf/
├── server/                 # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & upload middleware
│   │   ├── services/      # PDF & Gemini services
│   │   └── server.ts      # Main server file
│   ├── uploads/           # PDF storage
│   └── package.json
│
├── client/                # Frontend (Next.js)
│   ├── app/              # Pages (App Router)
│   │   ├── (auth)/       # Login/Signup
│   │   ├── dashboard/    # Main dashboard
│   │   ├── upload/       # PDF upload page
│   │   ├── quiz/[id]/    # Quiz attempt page
│   │   └── results/[id]/ # Results page
│   ├── components/       # React components
│   ├── services/         # API services
│   ├── store/           # Zustand state management
│   ├── hooks/           # Custom hooks
│   └── package.json
│
└── README.md
```

---

## 🛠️ Troubleshooting

### MongoDB Connection Error

**Problem:** `MongoDB Connection Error`

**Solution:**
1. Make sure MongoDB is running: `net start MongoDB`
2. Verify MongoDB is installed: `mongod --version`
3. Check if port 27017 is available

### Port Already in Use

**Problem:** `Port 5000 is already in use`

**Solution:**
1. Change the port in `server/.env`:
   ```
   PORT=5001
   ```
2. Update `client/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

### Gemini API Error

**Problem:** `Failed to generate quiz`

**Solution:**
1. Verify your Gemini API key is correct in `server/.env`
2. Make sure the API key has proper permissions
3. Check your internet connection

### PDF Upload Not Working

**Problem:** `Error uploading file`

**Solution:**
1. Make sure `server/uploads` folder exists
2. Check file size is under 10MB
3. Verify the file is a valid PDF

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Quiz
- `POST /api/quiz/upload` - Upload PDF
- `POST /api/quiz/generate` - Generate quiz from PDF
- `GET /api/quiz/:id` - Get quiz by ID
- `GET /api/quiz/history` - Get user's quiz history
- `DELETE /api/quiz/:id` - Delete quiz

### Results
- `POST /api/result/submit` - Submit quiz answers
- `GET /api/result/:id` - Get quiz result

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats

---

## 🎨 Features

✅ JWT Authentication
✅ PDF Upload & Parsing
✅ AI-Powered Quiz Generation (Gemini 2.0 Flash)
✅ Interactive Quiz Interface
✅ Real-time Timer
✅ Progress Tracking
✅ Detailed Results with Explanations
✅ Topic-Wise Performance Analytics
✅ Dashboard with Statistics
✅ Dark Theme UI
✅ Responsive Design
✅ Smooth Animations (Framer Motion)

---

## 🔒 Security Notes

- Never commit your `.env` files
- Change `JWT_SECRET` in production
- Keep your Gemini API key private
- Use strong passwords

---

## 📧 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all dependencies are installed
3. Make sure MongoDB is running
4. Check the console for error messages

---

## 🚀 Production Deployment

For production deployment:

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Build the backend:**
   ```bash
   cd server
   npm run build
   ```

3. **Use environment variables for:**
   - Production MongoDB URI
   - Secure JWT secret
   - Production client URL

4. **Consider using:**
   - PM2 for process management
   - Nginx as reverse proxy
   - MongoDB Atlas for database
   - Vercel/Netlify for frontend hosting

---

## 📄 License

MIT License - Feel free to use this project for learning and portfolio purposes!

---

**Happy Learning! 🎓**
