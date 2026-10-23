import api from '@/utils/api';

export const userService = {
  async getProfile() {
    const res = await api.get('/users/profile');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/users/profile/update', data);
    return res.data;
  },

  async updateProfileImage(formData) {
    const res = await api.patch('/users/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async changePassword(data) {
    const res = await api.patch('/users/password', data);
    return res.data;
  },

  // Admin APIs
  async getAllUsers() {
    const res = await api.get('/users');
    return res.data;
  },

  async getUserById(id) {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  async updateUserStatus(id, isActive) {
    const res = await api.patch(`/users/${id}/status`, { isActive });
    return res.data;
  },
};