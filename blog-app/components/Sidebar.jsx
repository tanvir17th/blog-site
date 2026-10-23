'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'All Blogs', href: '/dashboard/blogs' },
    { label: 'Create Blog', href: '/dashboard/blogs/create' },
    ...(isAdmin ? [{ label: 'Users', href: '/admin/users' }] : []),
    { label: 'Profile', href: '/dashboard/profile' },
    { label: 'Change Password', href: '/dashboard/change-password' },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen pt-20 px-4 space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              isActive
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}