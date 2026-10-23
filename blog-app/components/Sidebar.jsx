'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const userNav = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Blogs', href: '/dashboard/blogs' },
    { name: 'Create Blog', href: '/dashboard/blogs/create' },
    { name: 'Profile', href: '/dashboard/profile' },
    { name: 'Change Password', href: '/dashboard/change-password' },
  ];

  const adminNav = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'All Blogs', href: '/dashboard/blogs' },
    { name: 'Create Blog', href: '/dashboard/blogs/create' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Profile', href: '/dashboard/profile' },
    { name: 'Change Password', href: '/dashboard/change-password' },
  ];

  const navItems = isAdmin ? adminNav : userNav;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen pt-16 flex flex-col justify-between">
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}