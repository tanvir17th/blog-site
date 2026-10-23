'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { blogService } from '@/services/blog.service';

const CATEGORIES = ['Testing', 'Automation', 'Programming', 'DevOps', 'AI'];

export default function CreateBlogPage() {
  const [blogTitle, setBlogTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [blog, setBlog] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await blogService.createBlog({ blogTitle, blog, category });
      router.push('/dashboard/blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow border">
      <h1 className="text-2xl font-bold mb-6">Create New Blog</h1>

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
            placeholder="e.g. Introduction to Playwright"
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
            placeholder="Write your blog content here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Blog'}
        </button>
      </form>
    </div>
  );
}