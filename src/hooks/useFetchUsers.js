import { useState, useEffect } from "react";
import axios from "axios";

const useFetchUsers = () => {
  const [data, setData] = useState({ total: 0, users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/user/get-all-users", {
        withCredentials: true
      });

      if (res.data && res.data.success) {
        setData(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { data, loading, error, refetch: fetchUsers };
};

export default useFetchUsers;
