'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogService } from '@/services/blog.service';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ManageBlogsPage() {
  const { user, isAdmin } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogService.getAllBlogs();
      const allBlogs = response.data || response || [];
      // Admins see all blogs, normal users see only their own
      if (isAdmin) {
        setBlogs(allBlogs);
      } else {
        setBlogs(allBlogs.filter((b) => (b.author?.id || b.userId) === user?.id));
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBlogs();
  }, [user, isAdmin]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await blogService.deleteBlog(deleteId);
      setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete blog.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{isAdmin ? 'All Blogs' : 'My Blogs'}</h1>
        <Link
          href="/dashboard/blogs/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Create Blog
        </Link>
      </div>

      {loading ? (
        <div>Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="bg-white p-8 text-center text-gray-500 rounded-lg border">
          You haven't created any blogs yet.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((b) => {
                const id = b._id || b.id;
                return (
                  <tr key={id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {b.blogTitle || b.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {b.author?.firstName ? `${b.author.firstName} ${b.author.lastName}` : 'You'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link
                        href={`/dashboard/blogs/${id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}