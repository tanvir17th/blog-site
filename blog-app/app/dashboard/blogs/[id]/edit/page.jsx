'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { blogService } from '@/services/blog.service';

const CATEGORIES = ['Testing', 'Automation', 'Programming', 'DevOps', 'AI'];

export default function EditBlogPage({ params }) {
  const resolvedParams = use(params);
  const blogId = resolvedParams.id;

  const [blogTitle, setBlogTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [blog, setBlog] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await blogService.getBlogById(blogId);
        const data = response.data || response;
        setBlogTitle(data.blogTitle || data.title || '');
        setCategory(data.category || CATEGORIES[0]);
        setBlog(data.blog || data.content || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load blog data.');
      } finally {
        setLoading(false);
      }
    };

    if (blogId) fetchBlogData();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await blogService.updateBlog(blogId, { blogTitle, blog, category });
      router.push('/dashboard/blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading blog details for editing...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow border">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Blog Title</label>
          <input
            type="text"
            required
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Blog Content</label>
          <textarea
            required
            rows={8}
            value={blog}
            onChange={(e) => setBlog(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/blogs')}
            className="px-4 py-2 border text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Saving Changes...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}