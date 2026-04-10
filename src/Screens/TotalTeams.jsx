import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTeam from '../hooks/useTeam';
import useResults from '../hooks/useResults';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';

export default function TotalTeams() {
  const { viewAllTeams, deleteTeam, updateSubmissionStatus, updateTeamApproval, loading, error } = useTeam();
  const { uploadResult, loading: resultLoading } = useResults();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [teamsData, setTeamsData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Result form state
  const [resultForm, setResultForm] = useState({
    rank: 'Participant',
    score: 0,
    remarks: ''
  });

  const fetchTeams = async () => {
    const { success, data } = await viewAllTeams();
    if (success) {
      setTeamsData(data || []);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [viewAllTeams]);

  const openModal = (team) => {
    setSelectedTeam(team);
    setResultForm({
      rank: 'Participant',
      score: team.score || 0,
      remarks: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;

    const contestId = selectedTeam.contest?._id || selectedTeam.contest;
    const teamId = selectedTeam._id;

    const resultData = {
      contestId: contestId,
      results: [
        {
          teamId: teamId,
          rank: resultForm.rank,
          score: resultForm.score,
          remarks: resultForm.remarks
        }
      ]
    };

    const { success, message } = await uploadResult(resultData);
    if (success) {
      showToast("Result Recorded for Team Successfully!", "success");
      closeModal();
      fetchTeams();
    } else {
      showToast(message || "Failed to record result", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      const { success } = await deleteTeam(id);
      if (success) {
        fetchTeams();
      }
    }
  };

  const handleApprovalChange = async (teamId, status) => {
    const { success } = await updateTeamApproval(teamId, status);
    if (success) {
      if (selectedTeam && selectedTeam._id === teamId) {
        setSelectedTeam({...selectedTeam, approvalStatus: status});
      }
      fetchTeams();
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
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Submissions</h1>
            <p className="text-gray-500 mt-1">Manage contest teams and evaluate their project submissions.</p>
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
              Active Teams ({teamsData.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Team Name</th>
                  <th className="p-4 font-semibold">Leader</th>
                  <th className="p-4 font-semibold">Members</th>
                  <th className="p-4 font-semibold">Contest</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {teamsData.map((team) => (
                  <tr key={team._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <button 
                        onClick={() => openModal(team)}
                        className="font-bold text-gray-900 hover:text-[#8cc63f] transition-all text-left"
                      >
                        {team.teamName}
                      </button>
                      <div className="text-[10px] text-gray-400 font-mono">{team._id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{team.leader?.userName || 'N/A'}</div>
                      <div className="text-[11px] text-gray-400">{team.leader?.email}</div>
                    </td>
                    <td className="p-4">
                       <div className="flex -space-x-2">
                          {team.members?.map((m, i) => (
                             <div key={i} title={m.userName} className="w-7 h-7 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[10px] font-black text-gray-400">
                                {m.userName?.charAt(0).toUpperCase()}
                             </div>
                          ))}
                       </div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{team.contest?.contestTitle || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 justify-center">
                        <span className={`w-max px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          team.approvalStatus === 'Approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                          team.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                          'bg-[#fcb900]/10 text-[#e6a800] border border-[#fcb900]/20'
                        }`}>
                           App: {team.approvalStatus || 'Pending'}
                        </span>
                        <span className={`w-max px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          team.submissionStatus === 'Submitted' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                          Sub: {team.submissionStatus || 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Button 
                        onClick={() => openModal(team)}
                        variant="secondary" 
                        className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 border-none"
                      >
                        {team.submissionStatus === 'Submitted' ? 'Grade Team' : 'View Team'}
                      </Button>
                      <button 
                        onClick={() => handleDelete(team._id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        title="Delete Team"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {teamsData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                      No teams have been formed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Team Overview</h2>
                <p className="text-sm text-[#8cc63f] font-mono mt-1">Ref: {selectedTeam._id}</p>
              </div>
              <button 
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-10">
              {/* Contest Section */}
              <section>
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#8cc63f]/10 flex items-center justify-center text-[#8cc63f] font-bold text-lg">C</div>
                    <h3 className="font-bold text-gray-800">Contest Information</h3>
                 </div>
                 <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Active Contest</p>
                    <p className="font-bold text-gray-800 text-lg">{selectedTeam.contest?.contestTitle || 'N/A'}</p>
                 </div>
              </section>

              {/* Team Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-lg">T</div>
                   <h3 className="font-bold text-gray-800">Team Structure</h3>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Team Name</p>
                    <p className="font-bold text-gray-800 text-xl">{selectedTeam.teamName}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Leader</p>
                      <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-[#8cc63f] text-white flex items-center justify-center font-bold">L</div>
                         <div>
                            <p className="text-sm font-bold text-gray-800">{selectedTeam.leader?.userName}</p>
                            <p className="text-[10px] text-gray-400">{selectedTeam.leader?.email}</p>
                         </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Members ({selectedTeam.members?.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTeam.members?.map((m, i) => (
                           <div key={i} className="px-3 py-1.5 bg-white rounded-lg border border-gray-100 text-[11px] font-bold text-gray-600">
                             {m.userName}
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Approval Section */}
              <section>
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 font-bold text-lg">A</div>
                    <h3 className="font-bold text-gray-800">Admin Approval</h3>
                 </div>
                 <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Current Status</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                          selectedTeam.approvalStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                          selectedTeam.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-[#fcb900]/10 text-[#fcb900]'
                        }`}>
                          {selectedTeam.approvalStatus || 'Pending'}
                        </span>
                    </div>
                    <div className="flex gap-2.5 items-center">
                        <button 
                          onClick={() => handleApprovalChange(selectedTeam._id, 'Approved')}
                          disabled={selectedTeam.approvalStatus === 'Approved'}
                          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                            selectedTeam.approvalStatus === 'Approved' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                            : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 active:scale-95'
                          }`}
                        >
                          Approve Team
                        </button>
                        <button 
                          onClick={() => handleApprovalChange(selectedTeam._id, 'Rejected')}
                          disabled={selectedTeam.approvalStatus === 'Rejected'}
                          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                            selectedTeam.approvalStatus === 'Rejected' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                            : 'bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 active:scale-95'
                          }`}
                        >
                          Reject Team
                        </button>
                    </div>
                 </div>
              </section>

              {/* Submission Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold text-lg">S</div>
                   <h3 className="font-bold text-gray-800">Team Submission</h3>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                   <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        selectedTeam.submissionStatus === 'Submitted' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {selectedTeam.submissionStatus || 'Open'}
                      </span>
                   </div>
                  
                  {selectedTeam.submissionLink && (
                    <div>
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Shared Link</p>
                      <a href={selectedTeam.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-bold break-all">
                        {selectedTeam.submissionLink}
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {/* Result Recording Form (Admin Only) */}
              {selectedTeam.submissionStatus === 'Submitted' && (
                <section className="animate-in slide-in-from-bottom duration-500">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold text-lg">R</div>
                    <h3 className="font-bold text-gray-800">Team Grading</h3>
                  </div>
                  <form onSubmit={handleResultSubmit} className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Award Rank</label>
                        <select 
                          value={resultForm.rank}
                          onChange={(e) => setResultForm({...resultForm, rank: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm font-bold text-gray-700"
                        >
                          <option value="1st">🥇 1st Place</option>
                          <option value="2nd">🥈 2nd Place</option>
                          <option value="3rd">🥉 3rd Place</option>
                          <option value="Participant">🏆 Participant</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Team Score (0-100)</label>
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          value={resultForm.score}
                          onChange={(e) => setResultForm({...resultForm, score: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm font-bold text-gray-700"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Feedback for Team</label>
                      <textarea 
                        value={resultForm.remarks}
                        onChange={(e) => setResultForm({...resultForm, remarks: e.target.value})}
                        placeholder="Add some team-specific feedback..."
                        className="w-full px-4 py-3 rounded-xl border border-purple-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm font-medium text-gray-700 min-h-[100px] resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={resultLoading}
                      className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-purple-200"
                    >
                      {resultLoading ? "Recording Results..." : "Finalize Team Results"}
                    </Button>
                  </form>
                </section>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-50 flex justify-end gap-3 sticky bottom-0 bg-white/80 backdrop-blur-md">
              <Button onClick={closeModal} variant="outline" className="px-6 border-gray-200">Close Panel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
