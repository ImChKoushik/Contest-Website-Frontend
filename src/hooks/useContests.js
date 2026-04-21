import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";

const useContests = () => {
  const [data, setData] = useState({ total: 0, contests: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchContests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/contest/stu-contest");
      if (res.data && res.data.success) {
        setData(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch contests");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred while fetching contests";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllContests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/contest/all-contests");
      if (res.data && res.data.success) {
        setData(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch all contests");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "An error occurred while fetching all contests";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const addContest = async (contestData) => {
    setLoading(true);
    setError(null);
    try {
      // If contestData is NOT FormData, this will still work but won't include files
      const res = await axiosInstance.post("/contest/add-contest", contestData, {
        headers: {
          'Content-Type': contestData instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      });
      if (res.data && res.data.success) {
        showToast("Contest added successfully", "success");
        return res.data.data;
      } else {
        setError(res.data.message || "Failed to add contest");
        return null;
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to create contest";
      setError(msg);
      showToast(msg, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateContestImage = async (contestId, imageFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('contestImage', imageFile);

      const res = await axiosInstance.put(`/contest/update-contest-image/${contestId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data && res.data.success) {
        showToast("Image updated successfully", "success");
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update image";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateContestStatus = async (contestId, status) => {
    try {
      const res = await axiosInstance.patch(`/contest/update-contest/${contestId}`, { status });
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      } else {
        return { success: false, message: res.data.message || "Failed to update status" };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update status";
      return { success: false, message: msg };
    }
  };

  const updateContest = async (contestId, contestData) => {
    try {
      const res = await axiosInstance.patch(`/contest/update-contest/${contestId}`, contestData);
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      } else {
        return { success: false, message: res.data.message || "Failed to update contest" };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update contest";
      return { success: false, message: msg };
    }
  };

  const deleteContest = async (contestId) => {
    try {
      const res = await axiosInstance.delete(`/contest/delete-contest/${contestId}`);
      if (res.data && res.data.success) {
        showToast(res.data.message || "Contest deleted successfully", "success");
        return { success: true };
      }
      return { success: false, message: res.data.message || "Delete failed" };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete contest";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  return { 
    data, 
    loading, 
    error, 
    fetchContests, 
    fetchAllContests, 
    addContest, 
    updateContestStatus, 
    updateContest, 
    updateContestImage,
    deleteContest 
  };
};

export default useContests;
