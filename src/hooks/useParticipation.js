import { useState } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const useParticipation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [participantsData, setParticipantsData] = useState({ total: 0, data: [] });

  const [myParticipations, setMyParticipations] = useState([]);
  const { showToast } = useToast();

  const joinContest = async (contestId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "https://contest-backend-td3m.onrender.com/api/v1/participate/join",
        { contestId },
        { withCredentials: true }
      );

      if (res.data) {
        return { success: true, message: res.data.message || "Joined Successfully!" };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to join contest";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const submitProject = async (contestId, submissionLink, description) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.put(
        "https://contest-backend-td3m.onrender.com/api/v1/participate/submit",
        { contestId, submissionLink, description },
        { withCredentials: true }
      );

      if (res.data) {
        return { success: true, message: res.data.message || "Project submitted successfully!" };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to submit project";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const fetchAllParticipants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        "https://contest-backend-td3m.onrender.com/api/v1/participate/admin/all",
        { withCredentials: true }
      );
      if (res.data && res.data.data) {
        setParticipantsData({
          total: res.data.data.total || 0,
          data: Array.isArray(res.data.data.data) ? res.data.data.data : []
        });
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch participants";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const fetchMyParticipations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        "https://contest-backend-td3m.onrender.com/api/v1/participate/all",
        { withCredentials: true }
      );
      if (res.data && res.data.data) {
        // If data is nested as { data: { data: [...] } }
        if (Array.isArray(res.data.data.data)) {
          setMyParticipations(res.data.data.data);
          return { success: true, data: res.data.data.data };
        }
        // If data is nested as { data: [...] }
        if (Array.isArray(res.data.data)) {
          setMyParticipations(res.data.data);
          return { success: true, data: res.data.data };
        }
      } else if (res.data && Array.isArray(res.data)) {
        // Fallback if the array is directly at the root
        setMyParticipations(res.data);
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.message || "Failed to fetch your participations";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const deleteParticipation = async (participationId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.delete(
        `https://contest-backend-td3m.onrender.com/api/v1/participate/admin/delete/${participationId}`,
        { withCredentials: true }
      );
      if (res.data) {
        showToast("Participation deleted successfully", "success");
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to delete participation";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return { joinContest, submitProject, fetchAllParticipants, fetchMyParticipations, deleteParticipation, participantsData, myParticipations, loading, error };
};

export default useParticipation;
