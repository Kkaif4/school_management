'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from './auth/AuthForm';

export const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();

  // prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showAuthModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAuthModal]);

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              SchoolManager
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/#features"
                className="text-gray-700 hover:text-indigo-600">
                Features
              </Link>
              <Link
                href="/#about"
                className="text-gray-700 hover:text-indigo-600">
                About
              </Link>
              <Link
                href="/#contact"
                className="text-gray-700 hover:text-indigo-600">
                Contact
              </Link>
            </nav>

            {/* Auth button */}
            {isAuthenticated() ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent 
                           text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Dashboard
              </Link>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent 
                           text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          onClick={() => setShowAuthModal(false)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-6 rounded-2xl shadow-lg w-[448px]">
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <span className="sr-only">Close</span>✕
            </button>

            <div className="bg-white">
              <AuthForm onSuccess={() => setShowAuthModal(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
