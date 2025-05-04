'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getStoredAuthData } from '@/lib/auth-utils';
import { authApi } from '@/lib/auth-api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const checkAuth = () => {
      try {
        const { user, tokens } = getStoredAuthData();
        
        // If user is already logged in and is admin, redirect to intended destination or home
        if (user && tokens.idToken && user.type.includes('Admin')) {
          const callbackUrl = searchParams.get('callbackUrl') || '/';
          router.push(callbackUrl);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        toast.error('Failed to check authentication status');
      }
    };

    checkAuth();
  }, [router, searchParams]);

  const handleLogin = async () => {
    try {
      const { url } = await authApi.getLoginUrl();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to get login URL:', error);
      toast.error('Failed to initiate login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in with your admin account
          </p>
        </div>
        <Button
          onClick={handleLogin}
          className="w-full"
        >
          Sign in with Auth0
        </Button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
} 