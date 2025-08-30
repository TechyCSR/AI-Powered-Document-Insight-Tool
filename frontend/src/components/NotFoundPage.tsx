import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex flex-col">
      {/* Header with theme toggle */}
      <div className="flex justify-end p-6">
        <ThemeToggle />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="relative">
              {/* Animated background circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full animate-pulse opacity-20"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-purple-100 dark:bg-purple-900/20 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1s' }}></div>
              </div>
              
              {/* 404 Text */}
              <div className="relative z-10 py-16">
                <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text mb-4">
                  404
                </h1>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🤖 Page Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
              The page you're looking for seems to have wandered off into the digital void. 
              Our AI couldn't locate it in any dimension!
            </p>
          </div>

          {/* Helpful Actions */}
          <div className="grid gap-4 mb-8 max-w-md mx-auto md:max-w-2xl md:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-blue-500 dark:text-blue-400 mb-3">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Document Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Upload and analyze PDFs with AI-powered insights
              </p>
              <Link 
                to="/dashboard" 
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Go to Dashboard
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-green-500 dark:text-green-400 mb-3">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0h3m0 0h3m0 0a1 1 0 001-1V10M9 21v-7a1 1 0 011-1h4a1 1 0 011 1v7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Home Page
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Learn more about our AI-powered document insights
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
              >
                Go Home
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Additional Help */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 md:p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              🔍 What you can do:
            </h3>
            <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">📄</span>
                <span>Upload documents for AI analysis</span>
              </div>
              <div className="flex items-start">
                <span className="text-purple-500 mr-2">📊</span>
                <span>View your document history</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">🤖</span>
                <span>Get intelligent insights</span>
              </div>
            </div>
          </div>

          {/* Fun Error Codes */}
          <div className="mt-8 text-xs text-gray-400 dark:text-gray-600">
            <p>Error Code: AI_CONFUSION_404 • Document not found in any neural network</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-6 text-center text-xs text-gray-400 dark:text-gray-600">
        <p>© 2025 TechyCSR • AI-Powered Document Analysis • <Link to="/" className="hover:text-blue-500">summary.techycsr.me</Link></p>
      </div>
    </div>
  );
};

export default NotFoundPage;
