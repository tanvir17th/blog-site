'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { getImageUrl } from '@/utils/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      if (user.profileImage) {
        setImagePreview(getImageUrl(user.profileImage));
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedFile) {
      setMsg({ type: 'error', text: 'Please select an image file first.' });
      return;
    }

    setUploading(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await userService.updateProfileImage(formData);
      const newImagePath = response.profileImage || response.data?.profileImage;

      const formattedUrl = getImageUrl(newImagePath);
      setImagePreview(formattedUrl);

      // Update AuthContext so top navbar and profile update immediately
      if (updateUser) {
        updateUser({ ...user, profileImage: formattedUrl });
      }

      setSelectedFile(null);
      setMsg({ type: 'success', text: 'Profile image updated successfully!' });
    } catch (err) {
      console.error('Image upload failed:', err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upload profile image.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      await userService.updateProfile({ firstName, lastName });
      if (updateUser) {
        updateUser({ ...user, firstName, lastName });
      }
      setMsg({ type: 'success', text: 'Profile details updated successfully.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile details.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile Management</h1>

      {msg.text && (
        <div
          className={`p-3 rounded text-sm ${
            msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* SEPARATE FORM 1: PROFILE IMAGE UPLOAD */}
      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <h2 className="text-lg font-bold">Profile Image</h2>

        <form onSubmit={handleImageUpload} className="flex items-center space-x-6">
          <img
            src={imagePreview || 'https://via.placeholder.com/150'}
            alt="Profile Avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />

          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />

            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
      </div>

      {/* SEPARATE FORM 2: PERSONAL DETAILS */}
      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <h2 className="text-lg font-bold">Personal Details</h2>

        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              disabled
              value={email}
              className="mt-1 block w-full border rounded-md p-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}