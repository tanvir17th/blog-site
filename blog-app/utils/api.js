import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Named export needed by Navbar and Profile components
export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/150';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `http://localhost:5000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default api;