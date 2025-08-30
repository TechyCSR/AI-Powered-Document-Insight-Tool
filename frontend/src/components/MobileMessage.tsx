import React from 'react';
import ThemeToggle from './ThemeToggle';

const MobileMessage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header with theme toggle */}
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg mx-auto text-center">
          {/* Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🖥️ Desktop Application
          </h1>
          
          {/* Message */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              <strong>AI-Powered Document Insight Tool</strong> is optimized for desktop use.
            </p>
            
            <div className="text-left space-y-3 text-gray-600 dark:text-gray-400">
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">📱</span>
                <span>Mobile support is limited due to file upload complexity</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">💻</span>
                <span>Best experience on desktop with large screen</span>
              </div>
              <div className="flex items-start">
                <span className="text-purple-500 mr-2">📄</span>
                <span>PDF processing requires desktop file handling</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              To use this application:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Open on a desktop or laptop computer</li>
              <li>• Use Chrome, Firefox, Safari, or Edge browser</li>
              <li>• Ensure stable internet connection</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Visit <strong>summary.techycsr.me</strong> on desktop</p>
          </div>
        </div>
      </div>
      
      {/* Bottom branding */}
      <div className="p-4 text-center text-xs text-gray-400 dark:text-gray-600">
        <p>© 2025 TechyCSR • AI-Powered Document Analysis</p>
      </div>
    </div>
  );
};

export default MobileMessage;
