import { useState, useCallback } from "react";
import axios from "axios";
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
      const res = await axios.post(
        "https://contest-backend-td3m.onrender.com/api/v1/result/upload",
        resultData,
        { withCredentials: true }
      );
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
      const res = await axios.get(
        "https://contest-backend-td3m.onrender.com/api/v1/result/all",
        { withCredentials: true }
      );
      if (res.data && res.data.success) {
        setAllResults(res.data.data || []);
      } else {
        setError(res.data.message || "Failed to fetch results");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        "https://contest-backend-td3m.onrender.com/api/v1/result/my",
        { withCredentials: true }
      );
      if (res.data && res.data.success) {
        setMyResults(res.data.data || []);
      } else {
        setError(res.data.message || "Failed to fetch your results");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResult = async (resultId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(
        `https://contest-backend-td3m.onrender.com/api/v1/result/${resultId}`,
        updateData,
        { withCredentials: true }
      );
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
      const res = await axios.delete(
        `https://contest-backend-td3m.onrender.com/api/v1/result/${resultId}`,
        { withCredentials: true }
      );
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
