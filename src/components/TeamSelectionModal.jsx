import React, { useState, useEffect } from 'react';
import useTeam from '../hooks/useTeam';
import useInvite from '../hooks/useInvite';
import Button from './Button';
import Input from './Input';

export default function TeamSelectionModal({ isOpen, onClose, contestId, contestTitle, projectType, onSuccess }) {
  const { createTeam, viewAllTeams, loading: teamLoading } = useTeam();
  const { requestToJoin, loading: inviteLoading } = useInvite();
  // Combined loading state for convenience if needed, otherwise use specific ones
  const loading = teamLoading || inviteLoading;
  const [view, setView] = useState('choice'); // 'choice', 'create', 'join', 'success'
  const [teamName, setTeamName] = useState('');
  const [createdTeam, setCreatedTeam] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [fetchingTeams, setFetchingTeams] = useState(false);

  useEffect(() => {
    if (view === 'join' && isOpen) {
      fetchTeams();
    }
  }, [view, isOpen]);

  const fetchTeams = async () => {
    setFetchingTeams(true);
    const { success, data } = await viewAllTeams();
    if (success) {
      setAvailableTeams(data.filter(t => t.contest?._id === contestId || t.contest === contestId));
    }
    setFetchingTeams(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const { success, data } = await createTeam(teamName, contestId);
    if (success) {
      setCreatedTeam(data);
      setView('success');
      onSuccess();
    }
  };

  const handleJoinRequest = async (teamId) => {
    const { success } = await requestToJoin(teamId);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose}></div>

      <div className="bg-white rounded-[40px] w-full max-w-lg relative z-10 shadow-[0_20px_70px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{contestTitle}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8cc63f] animate-pulse"></span>
              <p className="text-[11px] text-[#8cc63f] font-black uppercase tracking-widest">
                {projectType === 'Individual' ? 'Solo Participation' : projectType === 'Both' ? 'Solo or Team' : 'Team Challenge'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {view === 'choice' && (
            <div className="space-y-4">
              <button
                onClick={() => setView('create')}
                className="w-full p-8 text-left border-2 border-transparent bg-gray-50/50 rounded-[32px] hover:bg-white hover:border-[#8cc63f] hover:shadow-xl hover:shadow-[#8cc63f]/5 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8cc63f]/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-[22px] bg-white shadow-sm flex items-center justify-center text-[#8cc63f] group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-1">Create Team</h3>
                    <p className="text-sm text-gray-500 font-medium">Build your squad and lead the way.</p>
                  </div>
                </div>
              </button>

              {(projectType === 'Team' || projectType === 'Both') && (
                <button
                  onClick={() => setView('join')}
                  className="w-full p-8 text-left border-2 border-transparent bg-gray-50/50 rounded-[32px] hover:bg-white hover:border-[#fcb900] hover:shadow-xl hover:shadow-[#fcb900]/5 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#fcb900]/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-[22px] bg-white shadow-sm flex items-center justify-center text-[#fcb900] group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.971 5.971 0 00-.941 3.197m0 0l.001.031c0 .225.012.447.038.666M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg mb-1">Join a Team</h3>
                      <p className="text-sm text-gray-500 font-medium">Find public teams and request to join.</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          )}

          {view === 'create' && (
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="bg-[#8cc63f]/5 p-6 rounded-[24px] border border-[#8cc63f]/10 mb-2">
                <p className="text-xs font-bold text-[#8cc63f] uppercase tracking-wider mb-2">Step 1: Choose a Name</p>
                <Input
                  label="Team Identity"
                  placeholder="e.g. Code Warriors, Pixel Wizards..."
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setView('choice')}
                  className="flex-1 rounded-2xl py-4"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-gray-900 hover:bg-black text-white rounded-2xl py-4 shadow-xl shadow-gray-200"
                >
                  {loading ? "Creating..." : "Launch Team"}
                </Button>
              </div>
            </form>
          )}

          {view === 'join' && (
            <div className="space-y-4">
              <button
                onClick={() => setView('choice')}
                className="text-xs font-black text-gray-400 hover:text-gray-900 flex items-center gap-2 mb-4 transition-colors uppercase tracking-widest"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back to Options
              </button>

              <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {fetchingTeams ? (
                  <div className="py-20 flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#8cc63f]/20 border-t-[#8cc63f] rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-gray-400 animate-pulse">Scanning for teams...</p>
                  </div>
                ) : availableTeams.length === 0 ? (
                  <div className="py-16 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold mb-3">No teams found yet.</p>
                    <button onClick={() => setView('create')} className="text-[#8cc63f] font-black text-sm hover:underline uppercase tracking-wider">Be the first to create one!</button>
                  </div>
                ) : (
                  availableTeams.map(team => (
                    <div key={team._id || team.id} className="p-6 rounded-[32px] border border-gray-100 bg-white hover:border-[#8cc63f]/30 transition-all group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-gray-900 leading-tight mb-1 truncate">{team.teamName}</h4>
                            <p className="text-xs font-bold text-gray-400 truncate">Leader: {team.leader?.userName || 'Elite Scout'}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleJoinRequest(team._id || team.id);
                          }}
                          disabled={loading}
                          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#8cc63f] hover:bg-black text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#8cc63f]/10 active:scale-95 disabled:opacity-50"
                        >
                          {loading ? 'Processing...' : 'Request to Join'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {view === 'success' && (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-[#8cc63f] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-[#8cc63f]/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">Team Redline!</h3>
              <p className="text-gray-500 font-medium mb-10 max-w-xs mx-auto">
                Your team <span className="text-gray-900 font-black">"{createdTeam?.teamName}"</span> was created successfully.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={onClose}
                  className="w-full bg-gray-900 hover:bg-black text-white rounded-2xl py-4 font-black shadow-xl shadow-gray-200"
                >
                  Go to Dashboard
                </Button>
                <p className="text-xs font-bold text-gray-400 mt-2">
                  Tip: You can invite teammates from the dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
