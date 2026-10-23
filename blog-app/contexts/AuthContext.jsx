'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api, { getImageUrl } from '@/utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reload user data on page refresh
  const loadUser = async (authToken) => {
    try {
      const res = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const userData = res.data?.user || res.data;

      if (userData) {
        userData.profileImage = getImageUrl(userData.profileImage);
      }

      setUser(userData);
      setToken(authToken);
    } catch (err) {
      console.error('Failed to load user on refresh:', err);
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      loadUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (authToken, userData) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    if (userData) {
      userData.profileImage = getImageUrl(userData.profileImage);
      setUser(userData);
    } else {
      await loadUser(authToken);
    }
  };

  const updateUser = (updatedUserData) => {
    if (updatedUserData && updatedUserData.profileImage) {
      updatedUserData.profileImage = getImageUrl(updatedUserData.profileImage);
    }
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'Admin',
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);