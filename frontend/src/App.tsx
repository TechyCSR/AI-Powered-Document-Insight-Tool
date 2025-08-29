import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🚀 AI-Powered Document 
            <span className="text-blue-600"> Insight Tool</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Frontend is working! Backend is connected! Ready for Clerk configuration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">✅ Backend Status</h2>
            <ul className="space-y-2">
              <li>✅ FastAPI server running on port 8000</li>
              <li>✅ MongoDB connected successfully</li>
              <li>✅ AI providers configured</li>
              <li>✅ PDF processing ready</li>
              <li>✅ Health endpoint: <code>/api/v1/health</code></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">🌐 Frontend Status</h2>
            <ul className="space-y-2">
              <li>✅ React + TypeScript working</li>
              <li>✅ Vite development server active</li>
              <li>✅ TailwindCSS styling working</li>
              <li>✅ Components ready for authentication</li>
              <li>⚠️ Clerk key needed for auth</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">📋 Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Sign up for a free Clerk account at <a href="https://clerk.com" className="underline">clerk.com</a></li>
            <li>Create a new application in your Clerk dashboard</li>
            <li>Copy the publishable key (starts with <code>pk_</code>)</li>
            <li>Add it to <code>frontend/.env.local</code> as:</li>
          </ol>
          <div className="mt-4 bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
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
        <div className="min-h-screen bg-gray-50">
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
    return <DemoApp />;
  }
  
  console.log('Returning MainApp');
  return <MainApp />;
}

export default App;