import api from '@/utils/api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async forgotPassword(data) {
    const res = await api.post('/auth/forgot-password', data);
    return res.data;
  },

  async resetPassword(token, data) {
    const res = await api.patch(`/auth/reset-password/${token}`, data);
    return res.data;
  },
};