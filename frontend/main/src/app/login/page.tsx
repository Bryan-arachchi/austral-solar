'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStoredAuthData } from '@/lib/auth-utils';
import { authApi } from '@/lib/auth-api';
import { Button } from '@/components/ui/button';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      try {
        const { user, tokens } = getStoredAuthData();
        
        // If user is already logged in, redirect to intended destination or home
        if (user && tokens.idToken) {
          const callbackUrl = searchParams.get('callbackUrl') || '/';
          router.push(callbackUrl);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Failed to check authentication status');
      }
    };

    checkAuth();
  }, [router, searchParams]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { url } = await authApi.getLoginUrl();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to get login URL:', error);
      setError('Failed to initiate login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Austral Solar
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-600 text-center">
            {error}
          </div>
        )}
        <div className="mt-8">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4"
          >
            {isLoading ? 'Loading...' : 'Sign in with Auth0'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
} 