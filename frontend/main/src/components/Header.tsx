'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu as MenuIcon, X, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authApi } from '@/lib/auth-api';
import { getStoredAuthData, clearAuthData } from '@/lib/auth-utils';
import { Profile } from '../types/api';

const navigationLinks = [
  { name: "Home", href: "https://www.australsolar.click/" },
  { name: "Products", href: "/products" },
  { name: "Branchs", href: "/branchs" },
  { name: "Orders", href: "/orders" },
];

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const { user, tokens } = getStoredAuthData();
      if (user && tokens.accessToken && tokens.idToken) {
        setIsLoggedIn(true);
        setUser(user);
        setUsername(user.firstName || 'User');
      } else {
        setIsLoggedIn(false);
        setUser(null);
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
    setUser(null);
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
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <header className="border-b">
      <nav>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Austral Solar</span>
              <span className="text-green-500">.</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-green-500 text-white rounded-full p-0"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <div className="relative" ref={dropdownRef}>
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      type="button"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      <span>{username}</span>
                      <svg className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
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
                  </>
                ) : (
                  <Button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                  >
                    {isLoading ? 'Loading...' : 'Login'}
                  </Button>
                )}
              </div>
            </div>

            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}

                <Link
                  href="/cart"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                  {cartItemCount > 0 && (
                    <Badge className="ml-2 bg-green-500 text-white">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>

                <div className="relative">
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        type="button"
                        className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      >
                        <span>{username}</span>
                        <svg className={`ml-2 h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {showDropdown && (
                        <div className="mt-2 px-3 space-y-1 z-50 relative">
                          <button
                            onClick={navigateToProfile}
                            type="button"
                            className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                          >
                            Profile
                          </button>
                          <button
                            onClick={handleLogout}
                            type="button"
                            className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-green-500 hover:bg-green-600"
                    >
                      {isLoading ? 'Loading...' : 'Login'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
