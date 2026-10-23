'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requireAdmin && user?.role !== 'Admin') {
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, requireAdmin, router]);

  if (loading || !isAuthenticated) {
    return <div className="p-8 text-center">Loading authentication state...</div>;
  }

  if (requireAdmin && user?.role !== 'Admin') {
    return <div className="p-8 text-center text-red-600">Access Denied</div>;
  }

  return children;
}