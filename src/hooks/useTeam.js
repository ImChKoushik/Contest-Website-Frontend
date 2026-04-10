import { useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";

const useTeam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const createTeam = async (teamName, contestId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/team/create-team", { teamName, contestId });
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
      const res = await axiosInstance.post("/team/invite-user", { teamId, invitedUserEmail });
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
      const res = await axiosInstance.post("/team/accept-invite", { teamId });
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

  const rejectInvite = async (teamId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/team/reject-invite", { teamId });
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
      const res = await axiosInstance.post("/team/request-join", { teamId });
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
      const res = await axiosInstance.post("/team/accept-request", { teamId, requestUserEmail });
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
      const res = await axiosInstance.post("/team/reject-request", { teamId, requestUserEmail });
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
      const res = await axiosInstance.get(`/team/my-team/${contestId}`);
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
      const res = await axiosInstance.get(`/team/team/${teamId}`);
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
      const res = await axiosInstance.get("/team/user-team");
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
      const res = await axiosInstance.delete(`/team/delete-team/${teamId}`);
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
      const res = await axiosInstance.post("/team/add-submission", { teamId, link });
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
      const res = await axiosInstance.patch(`/team/update-submission/${teamId}`, { status });
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
      const res = await axiosInstance.get(`/team/submissions/${teamId}`);
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch submissions";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTeamApproval = async (teamId, status) => {
    setLoading(true);
    try {
      const res = await axiosInstance.patch(`/team/approve-team/${teamId}`, { status });
      showToast(res.data.message || `Team ${status}`, "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update team approval status";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const deleteTeamByUser = async (teamId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(`/team/delete/${teamId}`);
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

  return {
    createTeam, inviteUser, acceptInvite, rejectInvite, requestJoin,
    acceptRequest, rejectRequest, getMyTeam, getTeamDetails,
    viewAllTeams, deleteTeam, addSubmission,
    updateSubmissionStatus, getTeamSubmissions,
    updateTeamApproval, deleteTeamByUser,
    loading, error
  };
};

export default useTeam;
