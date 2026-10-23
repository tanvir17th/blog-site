import api from '@/utils/api';

export const blogService = {
  async getAllBlogs(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.title) query.append('title', params.title);
      if (params.category) query.append('category', params.category);
      
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await api.get(`/blogs${queryString}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching blogs from API:', error.response?.data || error.message);
      throw error;
    }
  },

  async getBlogById(id) {
    const res = await api.get(`/blogs/${id}`);
    return res.data;
  },

  async createBlog(blogData) {
    const res = await api.post('/blogs/create', blogData);
    return res.data;
  },

  async updateBlog(id, blogData) {
    const res = await api.put(`/blogs/update/${id}`, blogData);
    return res.data;
  },

  async deleteBlog(id) {
    const res = await api.delete(`/blogs/delete/${id}`);
    return res.data;
  },
};