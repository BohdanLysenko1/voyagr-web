'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Wait for auth state to load
    if (loading) return;

    // If user is not authenticated, show auth prompt
    if (!user) {
      setShowAuthPrompt(true);
    } else {
      setShowAuthPrompt(false);
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth prompt modal
  if (!user && showAuthPrompt) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-purple-500/5 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sign In Required
              </h2>
              <p className="text-gray-600">
                You need to be signed in to access this page. Sign in or create an account to continue.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </button>

              <button
                onClick={() => setShowSignUp(true)}
                className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Create Account
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full text-gray-600 py-2 rounded-lg font-medium hover:text-gray-900 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>

        {/* Auth Modals */}
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />

        <SignUpModal
          isOpen={showSignUp}
          onClose={() => setShowSignUp(false)}
          onSwitchToLogin={() => {
            setShowSignUp(false);
            setShowLogin(true);
          }}
        />
      </>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}
