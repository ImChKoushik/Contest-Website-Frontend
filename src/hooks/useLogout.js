import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout: contextLogout } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mark as intentional logout to prevent the 401 from showing "Login Again"
      sessionStorage.setItem('intentionalLogout', 'true');

      // Hit server-side logout (clears httpOnly cookies)
      await axiosInstance.get('/user/logout-user').catch(() => {});

    } catch (err) {
      console.error('Logout API failed:', err);
    } finally {
      // Always clear local state regardless of server response
      contextLogout();
      navigate('/signin');
      setLoading(false);
      // Clean up the flag
      setTimeout(() => sessionStorage.removeItem('intentionalLogout'), 1000);
    }
  };



  return { logout, loading, error };
};
