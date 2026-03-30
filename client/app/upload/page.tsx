'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useAuthStore } from '@/store/authStore';
import { quizService } from '@/services/quiz';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Upload, FileText, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [quizTitle, setQuizTitle] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setQuizTitle(selectedFile.name.replace('.pdf', ''));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await quizService.uploadPDF(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success && response.data) {
        setUploadedFilename(response.data.filename);
        toast.success('File uploaded successfully!');
        setIsUploading(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!uploadedFilename) {
      toast.error('Please upload a file first');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await quizService.generateQuiz(uploadedFilename, quizTitle);

      if (response.success && response.data) {
        toast.success('Quiz generated successfully!');
        router.push(`/quiz/${response.data._id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate quiz');
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-card/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Back</span>
                </Button>
              </Link>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                <Upload className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-base md:text-xl font-bold truncate">Upload Study Material</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Generate AI Quiz</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Upload your PDF study material and let AI create a personalized quiz for you
              </p>
            </div>

            {/* Dropzone */}
            {!uploadedFilename && (
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                  transition-all duration-200
                  ${isDragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                  }
                `}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                {isDragActive ? (
                  <p className="text-lg font-medium">Drop the PDF here...</p>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">
                      Drag & drop your PDF here, or click to select
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Maximum file size: 10MB
                    </p>
                  </>
                )}
              </div>
            )}

            {/* File Selected */}
            {file && !uploadedFilename && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-background rounded-lg border border-gray-200 dark:border-gray-800">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quiz Title (Optional)</label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-background border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter a custom title for your quiz"
                  />
                </div>

                {isUploading && (
                  <Progress value={uploadProgress} showLabel />
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleUpload}
                    isLoading={isUploading}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload PDF'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setQuizTitle('');
                    }}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Generate Quiz */}
            {uploadedFilename && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-500 font-medium mb-2">✓ PDF Uploaded Successfully!</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ready to generate your quiz</p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleGenerateQuiz}
                  isLoading={isGenerating}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Quiz with AI
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setUploadedFilename('');
                    setQuizTitle('');
                    setUploadProgress(0);
                  }}
                  disabled={isGenerating}
                >
                  Upload Different File
                </Button>
              </motion.div>
            )}
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">PDF Upload</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload your study material</p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-medium mb-1">AI Processing</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI generates questions</p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-medium mb-1">Start Quiz</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Test your knowledge</p>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
