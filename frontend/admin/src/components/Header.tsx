/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/auth-api';
import { getStoredAuthData, clearAuthData } from '@/lib/auth-utils';

const navigationLinks = [
  { name: "Users", href: "/users" },
  { name: "Branchs", href: "/branchs" },
  { name: "Products", href: "/products" },
  { name: "Orders", href: "/orders" },
];

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const { user, tokens } = getStoredAuthData();
      if (user && tokens.accessToken && tokens.idToken) {
        setIsLoggedIn(true);
        setUsername(user.firstName || 'User');
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    };

    checkAuth();


    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'id_token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getLoginUrl();
      window.location.assign(response.url);
    } catch (error) {

      alert('Failed to initiate login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    setIsLoggedIn(false);
    setUsername('');
    setShowDropdown(false);
    router.push('/');
  };

  const navigateToProfile = () => {
    router.push('/profile');
    setShowDropdown(false);
  };

  const closeDropdown = () => setShowDropdown(false);

  useEffect(() => {
    const handleRouteChange = () => {
      closeDropdown();
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <header className="fixed top-0 left-0 h-full w-64 border-r bg-white">
      <nav className="h-full flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-black">Austral Solar</span>
            <span className="text-green-500">.</span>
          </Link>
        </div>

        <div className="flex-1 py-4">
          <div className="flex flex-col space-y-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 border-t">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                type="button"
                className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <span>{username}</span>
                <svg className={`ml-auto h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute bottom-full left-0 w-full mb-1 bg-white rounded-md shadow-lg py-1">
                  <button
                    onClick={navigateToProfile}
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
            >
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
