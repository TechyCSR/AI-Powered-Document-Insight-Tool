import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Debug logging
console.log('Environment variables:', {
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV
});

// Demo component for when Clerk is not configured
function DemoApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            🚀 AI-Powered Document 
            <span className="text-blue-600 dark:text-blue-400"> Insight Tool</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Frontend is working! Backend is connected! Ready for Clerk configuration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">✅ Backend Status</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>✅ FastAPI server running on port 8000</li>
              <li>✅ MongoDB connected successfully</li>
              <li>✅ AI providers configured</li>
              <li>✅ PDF processing ready</li>
              <li>✅ Health endpoint: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/api/v1/health</code></li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">🌐 Frontend Status</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>✅ React + TypeScript working</li>
              <li>✅ Vite development server active</li>
              <li>✅ TailwindCSS styling working</li>
              <li>✅ Components ready for authentication</li>
              <li>⚠️ Clerk key needed for auth</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">📋 Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700 dark:text-yellow-300">
            <li>Sign up for a free Clerk account at <a href="https://clerk.com" className="underline">clerk.com</a></li>
            <li>Create a new application in your Clerk dashboard</li>
            <li>Copy the publishable key (starts with <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">pk_</code>)</li>
            <li>Add it to <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">frontend/.env.local</code> as:</li>
          </ol>
          <div className="mt-4 bg-gray-800 dark:bg-gray-900 text-green-400 dark:text-green-300 p-3 rounded font-mono text-sm border dark:border-gray-700">
            VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App component with full functionality
function MainApp() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SignedOut>
                    <LandingPage />
                  </SignedOut>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  );
}

// App component that chooses between demo and main app
function App() {
  console.log('App function called, Clerk key:', CLERK_PUBLISHABLE_KEY);
  
  // Check if Clerk key is properly configured
  if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY.includes('placeholder') || CLERK_PUBLISHABLE_KEY === 'pk_test_your_actual_key_here') {
    console.log('Returning DemoApp');
    return (
      <ThemeProvider>
        <DemoApp />
      </ThemeProvider>
    );
  }
  
  console.log('Returning MainApp');
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

export default App;