import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const useUserActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.delete(`/user/delete-user/${id}`);
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
      const res = await axiosInstance.get(`/user/get-user/${id}`);
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

  const updateUserRole = async (id, role) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.patch(`/user/update-role/${id}`, { role });
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      } else {
        setError(res.data.message || "Failed to update role");
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

  return { deleteUser, getUserById, updateUserRole, loading, error };
};

export default useUserActions;
