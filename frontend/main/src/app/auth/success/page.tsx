'use client';
import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { parseAuthCallback, saveAuthData } from '@/lib/auth-utils';

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = () => {
      try {
        const authResponse = parseAuthCallback(searchParams);
        if (!authResponse) {
          router.replace('/login?error=invalid_callback');
          return;
        }

        saveAuthData(authResponse);

        // Parse the user data from the authResponse
        const userData = JSON.parse(authResponse.user);

        // Check authState and redirect accordingly
        if (userData.authState === "Verified") {
          window.location.href = '/additonal_infomration';
        } else if (userData.authState === "Signup_Complete") {
          window.location.href = '/';
        } else {
          // Default fallback
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.replace('/login?error=auth_failed');
      }
    };

    handleAuth();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
      <p className="text-gray-600">Completing authentication...</p>
    </div>
  );
}

export default function AuthSuccess() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      }
    >
      <AuthSuccessContent />
    </Suspense>
  );
}
