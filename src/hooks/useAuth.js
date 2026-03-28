import { useState } from "react";
import axios from "axios";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = async (url, formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(url, formData);

      console.log("Success:", res.data);

      return res.data; // important

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
      // Optionally rethrow or handle differently depending on your UI needs
    } finally {
      setLoading(false);
    }
  };

  return { sendRequest, loading, error };
};

export default useAuth;
