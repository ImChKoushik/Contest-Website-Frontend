import { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
      const res = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/contest/stu-contest", {
        withCredentials: true
      });

      // The backend returns { success: true, data: { total: 1, contests: [...] } }
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

  const addContest = async (contestData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "https://contest-backend-td3m.onrender.com/api/v1/contest/add-contest",
        contestData,
        { withCredentials: true }
      );

      if (res.data && res.data.success) {
        return res.data;
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

  const updateContestStatus = async (contestId, status) => {
    try {
      const res = await axios.patch(
        `https://contest-backend-td3m.onrender.com/api/v1/contest/update-status/${contestId}`,
        { status },
        { withCredentials: true }
      );
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

  const deleteContest = async (contestId) => {
    try {
      const res = await axios.delete(
        `https://contest-backend-td3m.onrender.com/api/v1/contest/delete-contest/${contestId}`,
        { withCredentials: true }
      );
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

  return { data, loading, error, fetchContests, addContest, updateContestStatus, deleteContest };
};

export default useContests;
