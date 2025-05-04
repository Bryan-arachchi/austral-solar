'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const authCheck = () => {
      const { user, tokens } = getStoredAuthData();
      
      if (!user || !tokens.idToken || !user.type.includes('Admin')) {
        setAuthorized(false);
        toast.error('Please login with an admin account to access this page');
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    };

    authCheck();

    // Set up interval to periodically check auth status
    const interval = setInterval(authCheck, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [router]);

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