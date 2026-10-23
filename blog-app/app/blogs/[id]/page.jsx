'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { blogService } from '@/services/blog.service';

export default function BlogDetailsPage({ params }) {
  const resolvedParams = use(params);
  const blogId = resolvedParams.id;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await blogService.getBlogById(blogId);
        const data = response.data || response;
        setBlog(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Blog post search failed.');
      } font-medium {
        setLoading(false);
      }
    };

    if (blogId) fetchBlog();
  }, [blogId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-20 pb-12">
        <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
          ← Back to Home
        </Link>

        {loading ? (
          <div className="text-center py-12">Loading blog details...</div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md border text-center">{error}</div>
        ) : blog ? (
          <article className="bg-white p-8 rounded-lg shadow-sm border space-y-6">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
              {blog.category}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900">{blog.blogTitle || blog.title}</h1>
            <div className="flex items-center space-x-3 pt-2">
              <img
                src={blog.author?.profileImage || 'https://via.placeholder.com/40'}
                alt="Author"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {blog.author?.firstName ? `${blog.author.firstName} ${blog.author.lastName}` : 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <hr />
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.blog || blog.content}
            </div>
          </article>
        ) : null}
      </main>
    </div>
  );
}