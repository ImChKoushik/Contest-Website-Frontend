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
      // Make the GET request to the explicit API endpoint you provided
      const response = await axiosInstance.get('/user/logout-user');
      
      // Clear the user from the global context
      contextLogout();
      
      // Optional: navigate home or to sign in
      navigate("/signin");
      
      return response.data;
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if the server fails, clear local context so they aren't stuck logged in
      contextLogout();
      navigate("/signin");
      setError(err.response?.data?.message || "An error occurred during logout");
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};
