'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow border">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your blogs, view your profile, or create a new blog post.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">Role</h2>
          <p className="text-xl font-bold text-indigo-600 mt-2">{user?.role || 'User'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">Quick Action</h2>
          <Link
            href="/dashboard/blogs/create"
            className="mt-3 inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
          >
            + Create New Blog
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">Profile Settings</h2>
          <Link
            href="/dashboard/profile"
            className="mt-3 inline-block text-indigo-600 text-sm hover:underline font-medium"
          >
            Edit Profile Details →
          </Link>
        </div>
      </div>
    </div>
  );
}