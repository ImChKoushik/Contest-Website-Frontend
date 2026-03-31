import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useContests = () => {
  const [data, setData] = useState({ total: 0, contests: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/contest/all-contests", {
        withCredentials: true
      });

      // The backend returns { success: true, data: { total: 1, contests: [...] } }
      if (res.data && res.data.success) {
        setData(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch contests");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred while fetching contests");
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
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  return { data, loading, error, fetchContests, addContest };
};

export default useContests;
