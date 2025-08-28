import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

function App() {
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

export default App;