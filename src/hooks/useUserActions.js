import { useState } from "react";
import axios from "axios";

const useUserActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.delete(`https://contest-backend-td3m.onrender.com/api/v1/user/delete-user/${id}`, {
        withCredentials: true
      });

      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      } else {
        setError(res.data.message || "Failed to delete user");
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Something went wrong";
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`https://contest-backend-td3m.onrender.com/api/v1/user/get-user/${id}`, {
        withCredentials: true
      });

      if (res.data && res.data.success) {
        return { success: true, data: res.data.data };
      } else {
        setError(res.data.message || "Failed to fetch user");
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Something went wrong";
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, getUserById, loading, error };
};

export default useUserActions;
