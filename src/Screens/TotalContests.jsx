import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useContests from '../hooks/useContests';
import useTeam from '../hooks/useTeam';
import Button from '../components/Button';
import ParticipantsModal from '../components/ParticipantsModal';
import { useToast } from '../context/ToastContext';

// Display labels shown in UI
const STATUS_OPTIONS = ['Upcoming', 'On-Going', 'Completed'];

// Map UI label → backend API value
const LABEL_TO_API = {
  'Upcoming':  'Upcoming',
  'On-Going':  'On-Going',
  'Completed': 'Completed',
};

// Map backend API value → UI label
const API_TO_LABEL = {
  'Upcoming':  'Upcoming',
  'On-Going':  'On-Going',
  'Completed': 'Completed',
};

const STATUS_STYLES = {
  'On-Going':  { dot: 'bg-[#8cc63f]',  text: 'text-[#7ab033]' },
  'Upcoming':  { dot: 'bg-[#fcb900]',  text: 'text-[#e6a800]' },
  'Completed': { dot: 'bg-gray-300',   text: 'text-gray-500'  },
};

export default function TotalContests() {
  const { data, loading, error, fetchAllContests, updateContestStatus, updateContest, deleteContest } = useContests();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [pendingStatus, setPendingStatus] = useState({});
  const [pendingType, setPendingType] = useState({});
  const [pendingSize, setPendingSize] = useState({});
  const [savingId, setSavingId] = useState(null);

  // Participants View State
  const { getContestParticipants } = useTeam();
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participantsData, setParticipantsData] = useState(null);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [selectedContestName, setSelectedContestName] = useState("");

  const handleViewParticipants = async (contestId, title) => {
    setSelectedContestName(title);
    setIsParticipantsModalOpen(true);
    setParticipantsLoading(true);
    const { success, data } = await getContestParticipants(contestId);
    if (success) setParticipantsData(data);
    setParticipantsLoading(false);
  };

  const handleStatusChange = (id, label) => {
    setPendingStatus(prev => ({ ...prev, [id]: label }));
  };

  const handleSaveContest = async (id) => {
    setSavingId(id);
    const updates = {};
    
    if (pendingStatus[id]) updates.status = LABEL_TO_API[pendingStatus[id]];
    if (pendingType[id]) updates.projectType = pendingType[id];
    if (pendingSize[id] !== undefined) updates.teamSize = Number(pendingSize[id]);

    if (Object.keys(updates).length === 0) {
      setSavingId(null);
      return;
    }

    let result;
    if (updates.status && Object.keys(updates).length === 1) {
       result = await updateContestStatus(id, updates.status);
    } else {
       result = await updateContest(id, updates);
    }

    if (result.success) {
      showToast('Contest updated successfully!', 'success');
      fetchAllContests();
      setPendingStatus(p => { const n = {...p}; delete n[id]; return n; });
      setPendingType(p => { const n = {...p}; delete n[id]; return n; });
      setPendingSize(p => { const n = {...p}; delete n[id]; return n; });
    } else {
      showToast(result.message || 'Failed to update', 'error');
    }
    setSavingId(null);
  };
  const handleDelete = async (id) => {
    if (window.confirm("ARE YOU ABSOLUTELY SURE? Deleting a contest will also remove all associated results and participations. This cannot be undone.")) {
      const result = await deleteContest(id);
      if (result.success) {
        fetchAllContests();
      }
    }
  };

  useEffect(() => {
    fetchAllContests();
  }, [fetchAllContests]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
        <div>
          <button 
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#8cc63f] font-bold text-sm mb-4 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Dashboard
          </button>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Full Contest Registry</h1>
          <p className="text-gray-500 mt-2">Comprehensive view of every specialization challenge in the system.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={fetchAllContests}
            className="px-5 py-2.5 text-sm font-bold flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh Data
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate("/admin-dashboard/add-contest")}
            className="px-6 py-2.5 text-sm font-bold shadow-lg shadow-[#8cc63f]/20"
          >
            + Create New
          </Button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        {error && (
          <div className="p-6 bg-red-50 text-red-600 border-b border-red-100 font-medium text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            Error loading contests: {error}
          </div>
        )}

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-[11px] uppercase font-black tracking-[0.1em]">
                <th className="p-6">Internal ID</th>
                <th className="p-6">Details</th>
                <th className="p-6">Category</th>
                <th className="p-6">Type</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Settings</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-gray-100 border-t-[#8cc63f] rounded-full animate-spin"></div>
                      <p className="text-gray-400 font-bold text-sm tracking-wide">Syncing with database...</p>
                    </div>
                  </td>
                </tr>
              ) : data?.contests?.length > 0 ? (
                data.contests.map((contest, i) => (
                  <tr key={contest._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-6">
                      <code className="text-[11px] font-mono bg-gray-100 text-gray-400 px-2 py-1 rounded group-hover:bg-[#8cc63f]/10 group-hover:text-[#8cc63f] transition-colors">
                        {contest._id.slice(-6)}
                      </code>
                    </td>
                    <td className="p-6">
                      <div className="max-w-[200px]">
                        <h4 className="font-bold text-gray-900 text-[14px] mb-0.5 truncate">{contest.contestTitle}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(contest.contestDeadLine).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                        {contest.category}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-2">
                         <select 
                          value={pendingType[contest._id] || contest.projectType}
                          onChange={(e) => setPendingType(prev => ({ ...prev, [contest._id]: e.target.value }))}
                          className={`text-[11px] font-black uppercase px-2 py-1 rounded border ${
                            (pendingType[contest._id] || contest.projectType) === 'Team' ? 'text-blue-600 border-blue-100 bg-blue-50' : 
                            (pendingType[contest._id] || contest.projectType) === 'Both' ? 'text-green-600 border-green-100 bg-green-50' :
                            'text-purple-600 border-purple-100 bg-purple-50'
                          }`}
                        >
                          <option value="Individual">Individual</option>
                          <option value="Team">Team</option>
                          <option value="Both">Both</option>
                        </select>
                        {(pendingType[contest._id] || contest.projectType) !== 'Individual' && (
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black text-gray-400 uppercase">Max Size:</span>
                             <input 
                              type="number"
                              min="2"
                              value={pendingSize[contest._id] ?? contest.teamSize ?? 1}
                              onChange={(e) => setPendingSize(prev => ({ ...prev, [contest._id]: e.target.value }))}
                              className="w-12 text-[10px] font-bold border border-gray-200 rounded px-1 py-0.5"
                             />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      {(() => {
                        const currentLabel = API_TO_LABEL[contest.status] || contest.status || 'N/A';
                        const selected = pendingStatus[contest._id] ?? currentLabel;
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider min-w-[100px]">
                              <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[currentLabel]?.dot || 'bg-gray-300'}`}></span>
                              <span className={STATUS_STYLES[currentLabel]?.text || 'text-gray-500'}>{currentLabel}</span>
                            </div>
                            <select
                              value={selected}
                              onChange={(e) => handleStatusChange(contest._id, e.target.value)}
                              className="text-[11px] border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-[#8cc63f]/30 cursor-pointer"
                            >
                              {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            {(selected !== currentLabel || pendingType[contest._id] || pendingSize[contest._id] !== undefined) && (
                              <button
                                onClick={() => handleSaveContest(contest._id)}
                                disabled={savingId === contest._id}
                                className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider bg-gray-900 text-white rounded-lg hover:bg-black transition disabled:opacity-50 shadow-lg shadow-gray-200"
                              >
                                {savingId === contest._id ? '...' : 'Update'}
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[12px] font-black text-gray-800">{contest.entryLimit}</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Limit</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewParticipants(contest._id, contest.contestTitle)}
                          className="p-2 rounded-xl bg-[#8cc63f]/10 text-[#8cc63f] hover:bg-[#8cc63f] hover:text-white transition-all shadow-sm border border-[#8cc63f]/20"
                          title="View Participants"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(contest._id)}
                          className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                          title="Delete Contest"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">No contests found</h3>
                      <p className="text-gray-500 text-sm">The registry appears to be empty.</p>
                      <Button variant="primary" onClick={() => navigate("/admin-dashboard/add-contest")} className="mt-4 px-8">Create First Contest</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ParticipantsModal 
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        title={`Participants: ${selectedContestName}`}
        data={participantsData}
        loading={participantsLoading}
        type="contest"
      />
    </div>
  );
}
