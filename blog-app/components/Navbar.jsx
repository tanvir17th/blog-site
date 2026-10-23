'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from './ProfileMenu';

export default function Navbar({ onSearchChange, searchValue }) {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-7xl">
        <Link href="/" className="flex items-center text-xl font-bold text-indigo-600">
          BlogSpace
        </Link>

        {onSearchChange && (
          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <ProfileMenu user={user} />
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium text-sm px-3 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm px-4 py-2 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}