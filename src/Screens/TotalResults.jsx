import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useResults from '../hooks/useResults';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';

export default function TotalResults() {
  const { fetchAllResults, allResults, deleteResult, updateResult, loading, error } = useResults();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [editForm, setEditForm] = useState({
    rank: '',
    score: 0,
    remarks: ''
  });

  useEffect(() => {
    fetchAllResults();
  }, [fetchAllResults]);

  const handleDelete = async (resultId) => {
    if (window.confirm("Are you sure you want to delete this result? This action cannot be undone.")) {
      const { success, message } = await deleteResult(resultId);
      if (success) {
        showToast("Result deleted successfully.", "success");
        fetchAllResults();
      } else {
        showToast(message || "Failed to delete result", "error");
      }
    }
  };

  const openEditModal = (result) => {
    setSelectedResult(result);
    setEditForm({
      rank: result.rank,
      score: result.score,
      remarks: result.remarks || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { success, message } = await updateResult(selectedResult._id, editForm);
    if (success) {
      showToast("Result updated successfully.", "success");
      setIsEditModalOpen(false);
      fetchAllResults();
    } else {
      showToast(message || "Failed to update result", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full transition-colors duration-300">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin-dashboard")}
            className="w-10 h-10 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]/80 border border-[var(--border-primary)] transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Contest Leaderboard</h1>
            <p className="text-[var(--text-secondary)] mt-1 font-medium">Final scores and ranks for all completed challenges.</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
           <Button variant="secondary" onClick={fetchAllResults} className="px-5 py-2 text-sm font-bold flex items-center gap-2 bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)]">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
             </svg>
             Sync Results
           </Button>
        </div>
      </div>

      {loading && !allResults.length ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-[var(--bg-primary)] border-t-[var(--accent-green)] rounded-full animate-spin"></div>
          <p className="text-[var(--text-secondary)] opacity-60 font-black text-xs tracking-[0.2em] uppercase">Calculating Scores...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-500 p-8 rounded-[32px] text-center border border-red-500/20 font-bold shadow-sm">
          {error}
        </div>
      ) : (
        <div className="bg-[var(--card-bg)] rounded-[32px] shadow-[var(--card-shadow)] border border-[var(--border-primary)] overflow-hidden transition-all">
          <div className="p-8 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/30 flex justify-between items-center transition-colors">
            <h3 className="font-black text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <span className="w-2 h-2 rounded-full bg-[#8cc63f]"></span>
              All Recorded Results ({allResults.length})
            </h3>
            {loading && <div className="w-4 h-4 border-2 border-[var(--accent-green)]/20 border-t-[var(--accent-green)] rounded-full animate-spin"></div>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-primary)]/50 text-[var(--text-secondary)] text-[10px] uppercase font-black tracking-widest border-b border-[var(--border-primary)] transition-colors">
                  <th className="p-6">Rank</th>
                  <th className="p-6">Team</th>
                  <th className="p-6">Contest</th>
                  <th className="p-6">Score</th>
                  <th className="p-6">Remarks</th>
                  <th className="p-6">Actions</th>
                  <th className="p-6 text-right">Recorded At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)] transition-colors">
                {allResults.map((res) => (
                  <tr key={res._id} className="hover:bg-[var(--bg-primary)]/50 transition-colors group">
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        res.rank === '1st' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' :
                        res.rank === '2nd' ? 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-primary)]' :
                        res.rank === '3rd' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' :
                        'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                      }`}>
                        {res.rank === '1st' && '🥇 '}
                        {res.rank === '2nd' && '🥈 '}
                        {res.rank === '3rd' && '🥉 '}
                        {res.rank}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-[var(--text-primary)] transition-colors">{res.team?.teamName || 'N/A'}</div>
                      <div className="text-[11px] text-[var(--text-secondary)] opacity-60 font-medium">Ref: {res.team?._id?.substring(0, 8)}...</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-[var(--text-primary)] opacity-90 transition-colors">{res.contest?.contestTitle || 'N/A'}</div>
                      <div className="text-[10px] text-[#8cc63f] font-black uppercase tracking-widest mt-0.5">{res.contest?.category}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                         <div className="flex-grow bg-[var(--bg-primary)] h-1.5 w-16 rounded-full overflow-hidden border border-[var(--border-primary)]">
                            <div 
                              className="h-full bg-[#8cc63f] rounded-full" 
                              style={{ width: `${res.score}%` }}
                            ></div>
                         </div>
                         <span className="font-black text-[var(--text-primary)] text-sm transition-colors">{res.score}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-xs text-[var(--text-secondary)] opacity-70 italic max-w-[150px] line-clamp-1 transition-colors">
                        "{res.remarks || 'No remarks provided.'}"
                      </p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={() => openEditModal(res)}
                           className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 transition-all border border-[var(--border-primary)]"
                           title="Edit Result"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                         </button>
                         <button 
                           onClick={() => handleDelete(res._id)}
                           className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-all border border-[var(--border-primary)]"
                           title="Delete Result"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                         </button>
                      </div>
                    </td>
                    <td className="p-6 text-right text-[var(--text-secondary)] opacity-50 text-[11px] font-bold">
                      {new Date(res.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {allResults.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-20 text-center text-[var(--text-secondary)] opacity-60 italic font-medium">
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mb-2">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 opacity-20">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                           </svg>
                         </div>
                         <p className="font-bold text-lg tracking-tight">No results recorded</p>
                         <p className="text-sm">The scoreboard is currently empty. Complete a contest to see results here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Result Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
           <div className="bg-[var(--card-bg)] rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl animate-in zoom-in duration-200 overflow-hidden border border-[var(--border-primary)] transition-all">
              <div className="p-8 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-primary)]/30 transition-colors">
                 <div>
                    <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Edit Contest Result</h2>
                    <p className="text-[10px] text-[var(--text-secondary)] font-black mt-1 uppercase tracking-widest opacity-60 transition-colors">{selectedResult?.contest?.contestTitle}</p>
                 </div>
                 <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 rounded-full bg-[var(--card-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-all shadow-sm border border-[var(--border-primary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1 opacity-60">Rank Award</label>
                       <select 
                         value={editForm.rank}
                         onChange={(e) => setEditForm({...editForm, rank: e.target.value})}
                         className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/10 outline-none text-sm font-bold text-[var(--text-primary)] transition-all"
                       >
                          <option value="1st" className="bg-[var(--card-bg)]">🥇 1st Place</option>
                          <option value="2nd" className="bg-[var(--card-bg)]">🥈 2nd Place</option>
                          <option value="3rd" className="bg-[var(--card-bg)]">🥉 3rd Place</option>
                          <option value="Participant" className="bg-[var(--card-bg)]">🏆 Participant</option>
                       </select>
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1 opacity-60">Score (0-100)</label>
                       <input 
                         type="number"
                         min="0"
                         max="100"
                         value={editForm.score}
                         onChange={(e) => setEditForm({...editForm, score: parseInt(e.target.value)})}
                         className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/10 outline-none text-sm font-bold text-[var(--text-primary)] transition-all"
                       />
                   </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1 opacity-60">Internal Feedback</label>
                    <textarea 
                       value={editForm.remarks}
                       onChange={(e) => setEditForm({...editForm, remarks: e.target.value})}
                       className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)] focus:border-[#8cc63f] focus:ring-4 focus:ring-[#8cc63f]/10 outline-none text-sm font-medium text-[var(--text-primary)] transition-all min-h-[100px] resize-none"
                       placeholder="Add notes about the performance..."
                    />
                </div>

                <div className="pt-2 flex gap-3">
                   <Button type="button" onClick={() => setIsEditModalOpen(false)} variant="outline" className="flex-grow py-3.5 border-[var(--border-primary)] text-[var(--text-primary)]">Cancel</Button>
                   <Button type="submit" disabled={loading} className="flex-grow py-3.5 bg-[#8cc63f] text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#8cc63f]/20 hover:bg-[#7ab033] transition-all">
                      {loading ? "Saving..." : "Save Changes"}
                   </Button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
