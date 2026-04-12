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

  const getContestParticipants = useCallback(async (contestId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/team/contest-participants/${contestId}`);
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch participants";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserParticipation = useCallback(async (userId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/team/user/${userId}/contests`);
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch user participation";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createTeam,
    getMyTeam,
    getTeamDetails,
    viewAllTeams,
    deleteTeam,
    addSubmission,
    updateSubmissionStatus,
    getTeamSubmissions,
    updateTeamApproval,
    deleteTeamByUser,
    getContestParticipants,
    getUserParticipation,
    loading,
    error
  };
};

export default useTeam;
