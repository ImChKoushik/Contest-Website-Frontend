import { useState } from "react";
import axios from "axios";

const useParticipation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [participantsData, setParticipantsData] = useState({ total: 0, data: [] });

  const [myParticipations, setMyParticipations] = useState([]);

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
        "https://contest-backend-td3m.onrender.com/api/v1/participate/all",
        { withCredentials: true }
      );

      if (res.data) {
        setParticipantsData({
          total: res.data.total || 0,
          data: res.data.data || []
        });
        return { success: true, data: res.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to fetch participants";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const fetchMyParticipations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try /my-participations first as it's the standard student endpoint
      // Fallback to /all if /my-participations fails (for backward compatibility or open backends)
      let res;
      try {
        res = await axios.get(
          "https://contest-backend-td3m.onrender.com/api/v1/participate/my-participations",
          { withCredentials: true }
        );
      } catch (e) {
        res = await axios.get(
          "https://contest-backend-td3m.onrender.com/api/v1/participate/all",
          { withCredentials: true }
        );
      }

      if (res.data && res.data.data) {
        setMyParticipations(res.data.data);
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      setError(err.message || "Failed to fetch your participations");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { joinContest, submitProject, fetchAllParticipants, fetchMyParticipations, participantsData, myParticipations, loading, error };
};

export default useParticipation;
