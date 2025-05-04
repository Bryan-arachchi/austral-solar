'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredAuthData } from '@/lib/auth-utils';
import { toast } from 'sonner';

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const authCheck = useCallback(() => {
    const { user, tokens } = getStoredAuthData();
    
    if (!user || !tokens.idToken) {
      setAuthorized(false);
      toast.error('Please login to access this page');
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    // Check authentication on mount
    authCheck();
  }, [authCheck]);

  // Show loading or nothing while doing authentication check
  if (!authorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If authorized, render child components
  return <>{children}</>;
} 