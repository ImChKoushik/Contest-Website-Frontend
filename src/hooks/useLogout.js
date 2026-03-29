import { useState } from 'react';
import axios from 'axios';
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
      const response = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/user/logout-user", {
        withCredentials: true // Ensure cookies are sent/cleared if applicable
      });
      
      // Clear the user from the global context
      contextLogout();
      
      // Optional: navigate home or to sign in
      navigate("/");
      
      return response.data;
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if the server fails, clear local context so they aren't stuck logged in
      contextLogout();
      navigate("/");
      setError(err.response?.data?.message || "An error occurred during logout");
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};
