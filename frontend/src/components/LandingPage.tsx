import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { FileText, Brain, Users, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">DocInsight AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <SignInButton mode="modal">
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-md transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                Get Started
              </button>
            </SignUpButton>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI-Powered Document 
            <span className="text-blue-600 dark:text-blue-400"> Insight Tool</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Upload your resume and get instant AI-powered insights. Our advanced AI analyzes your documents 
            and provides professional summaries to help you stand out.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <SignUpButton mode="modal">
              <button className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Start Analyzing</span>
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">PDF Processing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your resume in PDF format and let our AI extract and analyze the content with precision.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700">
            <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose between Sarvam AI and Gemini AI for intelligent document analysis and professional summaries.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700">
            <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Personal History</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Keep track of all your document analyses with a personalized history dashboard.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 dark:bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sign Up</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Create your account with Clerk authentication</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 dark:bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload PDF</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Upload your resume and choose an AI provider</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 dark:bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Our AI processes and analyzes your document</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 dark:bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Get Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Receive professional summaries and insights</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 mt-24 border-t dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">DocInsight AI</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500">
            Powered by Sarvam AI and Gemini AI • Built with FastAPI and React
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
