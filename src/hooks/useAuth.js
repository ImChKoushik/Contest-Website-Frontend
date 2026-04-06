import { useState } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const sendRequest = async (url, formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(url, formData, {
        withCredentials: true
      });

      console.log("Success:", res.data);

      return res.data; // important

    } catch (err) {
      const message = err.response?.data?.message || err.message || "Something went wrong";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return { sendRequest, loading, error };
};

export default useAuth;
