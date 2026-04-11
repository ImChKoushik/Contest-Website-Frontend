import { useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";

const useInvite = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const sendInvite = async (teamId, invitedUserEmail) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/invite/send", { teamId, invitedUserEmail });
      showToast(res.data.message || "Invitation sent", "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send invite";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const respondToInvite = async (inviteId, status) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/invite/respond-invite", { inviteId, status });
      showToast(res.data.message || `Invite ${status}`, "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || `Failed to ${status.toLowerCase()} invite`;
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const requestToJoin = async (teamId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/invite/request", { teamId });
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

  const respondToJoinRequest = async (inviteId, status) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/invite/respond-request", { inviteId, status });
      showToast(res.data.message || `Join request ${status}`, "success");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || `Failed to ${status.toLowerCase()} join request`;
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const getMyInvites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/invite/my-invites");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch invites";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/invite/my-requests");
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch join requests";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllInvites = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/invite/view-invite", { params });
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch all invites";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const getInviteById = useCallback(async (inviteId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/invite/admin/${inviteId}`);
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch invite details";
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInvite = async (inviteId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(`/invite/delete-invite/${inviteId}`);
      showToast(res.data.message || "Invite deleted successfully", "success");
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete invite";
      showToast(msg, "error");
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendInvite,
    respondToInvite,
    requestToJoin,
    respondToJoinRequest,
    getMyInvites,
    getMyRequests,
    getAllInvites,
    getInviteById,
    deleteInvite,
    loading,
    error,
  };
};

export default useInvite;
