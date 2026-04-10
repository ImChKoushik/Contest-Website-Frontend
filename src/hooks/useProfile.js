import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useToast } from '../context/ToastContext';
import { useAuthContext } from '../context/AuthContext';

export default function useProfile() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user, updateUser } = useAuthContext();

  const processUpdatedUser = (response) => {
    const updatedUser = response.data?.data || response.data;
    if (updatedUser && (updatedUser.role || updatedUser.email || updatedUser._id)) {
      // Force cache-busting timestamp on the new image URL so browser instantly repaints
      if (updatedUser.profileImage?.url) {
        updatedUser.profileImage.url = `${updatedUser.profileImage.url.split('?')[0]}?t=${Date.now()}`;
      }
      updateUser(updatedUser);
    }
  };

  const updateUserProfile = async (contact, oldPassword, newPassword) => {
    setLoading(true);
    let success = false;
    
    try {
      // Assuming PUT for profile/password details
      const response = await axiosInstance.put('/user/update-user', {
        contact,
        oldPassword,
        newPassword
      });
      
      showToast(response.data?.message || 'Profile updated successfully!', 'success');
      
      // Instantly inject the response into local state to force repaint
      processUpdatedUser(response);
      
      success = true;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update profile details.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
    
    return success;
  };

  const updateUserImage = async (formData) => {
    setLoading(true);
    let success = false;
    
    try {
      const response = await axiosInstance.put('/user/update-profile', formData);
      
      showToast(response.data?.message || 'Profile image updated successfully!', 'success');
      
      // Instantly inject the response into local state to force repaint
      processUpdatedUser(response);
      
      success = true;

    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update image.';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
    
    return success;
  };

  return { updateUserProfile, updateUserImage, loading };
}
