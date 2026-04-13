import { useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";

const useResults = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const { showToast } = useToast();

  const uploadResult = async (resultData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/result/upload", resultData);
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Upload failed" };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const fetchAllResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/result/all");
      if (res.data && res.data.success) {
        setAllResults(res.data.data || []);
        return { success: true, data: res.data.data };
      } else {
        setError(res.data.message || "Failed to fetch results");
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/result/my");
      if (res.data && res.data.success) {
        setMyResults(res.data.data || []);
        return { success: true, data: res.data.data };
      } else {
        setError(res.data.message || "Failed to fetch your results");
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const status = err.response?.status;
      // Silently ignore 401/403 — user is not authenticated
      if (status === 401 || status === 403) {
        setMyResults([]);
        return { success: false, message: "Unauthorized" };
      }
      const msg = err.response?.data?.message || err.message || "An error occurred";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResult = async (resultId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.patch(`/result/${resultId}`, updateData);
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Update failed" };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred during update";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const deleteResult = async (resultId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.delete(`/result/${resultId}`);
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Delete failed" };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred during delete";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    allResults,
    myResults,
    uploadResult,
    fetchAllResults,
    fetchMyResults,
    updateResult,
    deleteResult
  };
};

export default useResults;
