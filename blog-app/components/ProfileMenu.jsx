'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileMenu({ user }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const menuRef = useRef(null);

  const defaultAvatar = 'https://via.placeholder.com/150?text=User';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 text-sm font-medium focus:outline-none"
      >
        <img
          src={user?.profileImage || user?.image || defaultAvatar}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-300"
        />
        <span className="hidden md:inline text-gray-700">
          {user?.firstName} {user?.lastName}
        </span>
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border z-50">
          <div className="px-4 py-2 border-b text-xs text-gray-500">
            Role: <span className="font-semibold text-gray-700">{user?.role}</span>
          </div>
          <Link
            href="/dashboard/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/dashboard/change-password"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Change Password
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}