'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { blogService } from '@/services/blog.service';

const CATEGORIES = ['All', 'Testing', 'Automation', 'Programming', 'DevOps', 'AI'];

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [error, setError] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.title = search;
      if (category !== 'All') params.category = category;

      const response = await blogService.getAllBlogs(params);
      const data = response.data || response;
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load blogs:', err);
      setError('Could not connect to API server. Ensure backend is running.');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onSearchChange={setSearch} searchValue={search} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-20 pb-12">
        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-sm rounded-full font-medium transition ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-12 text-gray-600 font-medium">Loading blogs...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg p-4 max-w-lg mx-auto border border-red-200">
            {error}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No blogs found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id || blog.id} className="bg-white rounded-lg shadow-sm border p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {blog.category}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-2 line-clamp-2">
                    {blog.blogTitle || blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {blog.blog || blog.content}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={blog.author?.profileImage || 'https://via.placeholder.com/40'}
                      alt="Author"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {blog.author?.firstName ? `${blog.author.firstName} ${blog.author.lastName}` : 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/blogs/${blog._id || blog.id}`}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} BlogSpace. All rights reserved.
      </footer>
    </div>
  );
}