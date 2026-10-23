'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 pt-20 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}