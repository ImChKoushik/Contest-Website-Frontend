import { useState, useCallback } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const useTeam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const API_BASE = "https://contest-backend-td3m.onrender.com/api/v1/team";
  const ROOT_BASE = "https://contest-backend-td3m.onrender.com";

  const createTeam = async (teamName, contestId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/create-team`, { teamName, contestId }, { withCredentials: true });
      showToast(res.data.message || "Team created successfully", "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to create team";
      setError(msg);
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async (teamId, invitedUserEmail) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/invite-user`, { teamId, invitedUserEmail }, { withCredentials: true });
      showToast(res.data.message || "Invitation sent", "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to invite user";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const acceptInvite = async (teamId) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/accept-invite`, { teamId }, { withCredentials: true });
      showToast(res.data.message || "Invite accepted", "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to accept invite";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const rejectInvite = async (teamId, requestUserEmail) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/reject-request`, { teamId, requestUserEmail }, { withCredentials: true });
      showToast(res.data.message || "Invite rejected", "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reject invite";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const requestJoin = async (teamId) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/request-join`, { teamId }, { withCredentials: true });
      showToast(res.data.message || "Join request sent", "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send join request";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (teamId, requestUserEmail) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/accept-request`, { teamId, requestUserEmail }, { withCredentials: true });
      showToast(res.data.message || "Request accepted", "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to accept request";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async (teamId, requestUserEmail) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/reject-request`, { teamId, requestUserEmail }, { withCredentials: true });
      showToast(res.data.message || "Request rejected", "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reject request";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const getMyTeam = useCallback(async (contestId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/my-team/${contestId}`, { withCredentials: true });
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch team";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeamDetails = useCallback(async (teamId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/team/${teamId}`, { withCredentials: true });
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch team details";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const viewAllTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/user-team`, { withCredentials: true });
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch all teams";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTeam = async (teamId) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${ROOT_BASE}/delete-team/${teamId}`, { withCredentials: true });
      showToast(res.data.message || "Team deleted successfully", "success");
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete team";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const addSubmission = async (teamId, link) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/add-submission`, { teamId, link }, { withCredentials: true });
      showToast(res.data.message || "Submission successful", "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add submission";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (teamId, status) => {
    setLoading(true);
    try {
      const res = await axios.patch(`${ROOT_BASE}/update-submission/${teamId}`, { status }, { withCredentials: true });
      showToast(res.data.message || "Status updated", "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update status";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const getTeamSubmissions = useCallback(async (teamId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${ROOT_BASE}/submissions/${teamId}`, { withCredentials: true });
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch submissions";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    createTeam, inviteUser, acceptInvite, rejectInvite, requestJoin, 
    acceptRequest, rejectRequest, getMyTeam, getTeamDetails, 
    viewAllTeams, deleteTeam, addSubmission, 
    updateSubmissionStatus, getTeamSubmissions,
    loading, error 
  };
};

export default useTeam;
