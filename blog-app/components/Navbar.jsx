'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getImageUrl } from '@/utils/api';

export default function Navbar({ onSearchChange, searchValue = '' }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              BlogSpace
            </Link>

            {/* Optional Search Input */}
            {onSearchChange !== undefined && (
              <div className="hidden md:block w-72">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search blogs..."
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* User Auth Controls */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={getImageUrl(user?.profileImage)}
                    alt="Profile Avatar"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border z-50"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}