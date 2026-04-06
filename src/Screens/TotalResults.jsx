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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin-dashboard")}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Contest Leaderboard</h1>
            <p className="text-gray-500 mt-1 font-medium">Final scores and ranks for all completed challenges.</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
           <Button variant="secondary" onClick={fetchAllResults} className="px-5 py-2 text-sm font-bold flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
             </svg>
             Sync Results
           </Button>
        </div>
      </div>

      {loading && !allResults.length ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Calculating Scores...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-8 rounded-[32px] text-center border border-red-100 font-bold shadow-sm">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest text-xs">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              All Recorded Results ({allResults.length})
            </h3>
            {loading && <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                  <th className="p-6">Rank</th>
                  <th className="p-6">Student</th>
                  <th className="p-6">Contest</th>
                  <th className="p-6">Score</th>
                  <th className="p-6">Remarks</th>
                  <th className="p-6">Actions</th>
                  <th className="p-6 text-right">Recorded At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allResults.map((res) => (
                  <tr key={res._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        res.rank === '1st' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                        res.rank === '2nd' ? 'bg-gray-50 text-gray-600 border border-gray-100' :
                        res.rank === '3rd' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                        'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {res.rank === '1st' && '🥇 '}
                        {res.rank === '2nd' && '🥈 '}
                        {res.rank === '3rd' && '🥉 '}
                        {res.rank}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-gray-900">{res.user?.userName || 'N/A'}</div>
                      <div className="text-[11px] text-gray-400 font-medium">{res.user?.email}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-gray-700">{res.contest?.contestTitle || 'N/A'}</div>
                      <div className="text-[11px] text-purple-400 font-black uppercase tracking-tighter">{res.contest?.category}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                         <div className="flex-grow bg-gray-100 h-2 w-16 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full" 
                              style={{ width: `${res.score}%` }}
                            ></div>
                         </div>
                         <span className="font-black text-gray-900 text-sm">{res.score}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-xs text-gray-500 italic max-w-[150px] line-clamp-1">
                        "{res.remarks || 'No remarks provided.'}"
                      </p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={() => openEditModal(res)}
                           className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                           title="Edit Result"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                         </button>
                         <button 
                           onClick={() => handleDelete(res._id)}
                           className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                           title="Delete Result"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                         </button>
                      </div>
                    </td>
                    <td className="p-6 text-right text-gray-400 text-[11px] font-medium">
                      {new Date(res.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {allResults.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-20 text-center text-gray-400 italic font-medium">
                      <div className="flex flex-col items-center gap-3">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 opacity-20">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                         </svg>
                         No results have been recorded yet.
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
           <div className="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                 <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Edit Contest Result</h2>
                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{selectedResult?.contest?.contestTitle}</p>
                 </div>
                 <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rank Award</label>
                       <select 
                         value={editForm.rank}
                         onChange={(e) => setEditForm({...editForm, rank: e.target.value})}
                         className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-sm font-bold text-gray-700 transition-all"
                       >
                          <option value="1st">🥇 1st Place</option>
                          <option value="2nd">🥈 2nd Place</option>
                          <option value="3rd">🥉 3rd Place</option>
                          <option value="Participant">🏆 Participant</option>
                       </select>
                   </div>
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Score (0-100)</label>
                       <input 
                         type="number"
                         min="0"
                         max="100"
                         value={editForm.score}
                         onChange={(e) => setEditForm({...editForm, score: parseInt(e.target.value)})}
                         className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-sm font-bold text-gray-700 transition-all"
                       />
                   </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Internal Feedback</label>
                    <textarea 
                       value={editForm.remarks}
                       onChange={(e) => setEditForm({...editForm, remarks: e.target.value})}
                       className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-sm font-medium text-gray-700 transition-all min-h-[100px] resize-none"
                       placeholder="Add notes about the performance..."
                    />
                </div>

                <div className="pt-2 flex gap-3">
                   <Button type="button" onClick={() => setIsEditModalOpen(false)} variant="outline" className="flex-grow py-3.5 border-gray-100">Cancel</Button>
                   <Button type="submit" disabled={loading} className="flex-grow py-3.5 bg-purple-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-purple-600/20">
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
