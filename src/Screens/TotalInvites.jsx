import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useInvite from '../hooks/useInvite';
import { useToast } from '../context/ToastContext';

export default function TotalInvites() {
  const { getAllInvites, deleteInvite, loading } = useInvite();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [invitesData, setInvitesData] = useState([]);
  const [error, setError] = useState(null);

  const fetchInvites = async () => {
    try {
      const { success, data, message } = await getAllInvites();
      if (success) {
        setInvitesData(data?.invites || []);
      } else {
        setError(message);
      }
    } catch (err) {
      setError("Failed to fetch invites");
    }
  };

  useEffect(() => {
    fetchInvites();
  }, [getAllInvites]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invitation? This action cannot be undone.")) {
      const { success, message } = await deleteInvite(id);
      if (success) {
        showToast("Invitation deleted successfully", "success");
        fetchInvites();
      } else {
        showToast(message || "Failed to delete", "error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Invitations</h1>
            <p className="text-gray-500 mt-1">Review all squad invites and join requests sent across the platform.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8cc63f]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center border border-red-100 font-medium">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">
              Total Invites ({invitesData.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Sender</th>
                  <th className="p-4 font-semibold">Receiver</th>
                  <th className="p-4 font-semibold">Team</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {invitesData.map((invite) => (
                  <tr key={invite._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{invite.sender?.userName || 'N/A'}</div>
                      <div className="text-[11px] text-gray-400">{invite.sender?.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{invite.receiver?.userName || 'N/A'}</div>
                      <div className="text-[11px] text-gray-400">{invite.receiver?.email}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {invite.team?.teamName || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        invite.actionType === 'REQUEST' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {invite.actionType || 'INVITE'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        invite.status === 'Accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                        invite.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                        'bg-[#fcb900]/10 text-[#e6a800] border border-[#fcb900]/20'
                      }`}>
                         {invite.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => handleDelete(invite._id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        title="Delete Invite"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {invitesData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                      No invitations or requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
