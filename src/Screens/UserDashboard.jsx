import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ContestCard from '../components/ContestCard';
import useContests from '../hooks/useContests';
import useTeam from '../hooks/useTeam';
import useInvite from '../hooks/useInvite';
import TeamSelectionModal from '../components/TeamSelectionModal';
import InviteModal from '../components/InviteModal';
import { useAuthContext } from '../context/AuthContext';
import useResults from '../hooks/useResults';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';

// Local Category Images
import mernImg from '../assets/images/Mern.jpg';
import uiuxImg from '../assets/images/UI-UX.jpg';
import dmImg from '../assets/images/Digital-Marketing.jpg';
import webImg from '../assets/images/Website-Designing.jpg';

// Slider Images
import bannerSliderImg from '../assets/images/BannerSlider.jpg';
import mernHomeImg from '../assets/images/mernHome.jpg';
import learningImg from '../assets/images/learning.jpg';
import contestChallengeImg from '../assets/images/contestchallenge.jpg';
import contestImg2 from '../assets/images/contest2.jpg';
import contestBlogImg from '../assets/images/contest-blog-feature.jpg';
import candidateImg from '../assets/images/1000146438.webp';

// Doodle Images
import doodle1 from '../assets/images/1000146440.jpg';
import doodle2 from '../assets/images/1000146438.webp';

export default function UserDashboard() {
  const { user: currentUser } = useAuthContext();
  const [impactIdx, setImpactIdx] = useState(0);
  const impactImages = [contestChallengeImg, contestImg2, contestBlogImg];
  const navigate = useNavigate();

  const {
    viewAllTeams, getTeamDetails, getMyTeam,
    deleteTeamByUser,
    loading: teamLoading
  } = useTeam();
  const {
    getMyInvites, respondToInvite, respondToJoinRequest,
    loading: invLoading
  } = useInvite();
  const { fetchMyResults, myResults, loading: resultsLoading } = useResults();
  const { showToast } = useToast();

  const [myTeams, setMyTeams] = useState([]);
  const [myInvites, setMyInvites] = useState([]);
  const [selectedContestForTeam, setSelectedContestForTeam] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [teamToInvite, setTeamToInvite] = useState(null);

  const { data, loading, error } = useContests();

  const fetchUserTeams = async () => {
    if (!currentUser) return;

    if (currentUser.role === 'Admin') {
      const { success, data: allTeams } = await viewAllTeams();
      if (success) setMyTeams(allTeams);
      return;
    }

    const { success: invSuccess, data: invData } = await getMyInvites();
    if (invSuccess) setMyInvites(invData || []);

    // For regular users, fetch each team separately
    if (!loading && data?.contests) {
      const teamPromises = data.contests.map(c => getMyTeam(c._id));
      const results = await Promise.all(teamPromises);

      const rawTeams = results
        .filter(r => r.success && r.data)
        .map(r => r.data);

      // Fetch full details for each team to get the latest members and join requests
      const detailPromises = rawTeams.map(t => getTeamDetails(t._id));
      const detailResults = await Promise.all(detailPromises);

      const userTeams = detailResults
        .filter(r => r.success && r.data)
        .map(r => r.data);

      setMyTeams(userTeams);
    }
  };

  useEffect(() => {
    fetchUserTeams();
    fetchMyResults();
  }, [currentUser, data?.contests]);

  useEffect(() => {
    const timer = setInterval(() => {
      setImpactIdx((prev) => (prev + 1) % impactImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [impactImages.length]);


  return (
    <div className="bg-[var(--bg-primary)] min-h-screen font-sans w-full pb-20 transition-colors duration-300 relative overflow-x-hidden">
      {/* Background Doodles */}
      <div className="absolute top-[10%] -left-[10%] w-96 h-96 opacity-[0.035] dark:opacity-[0.015] pointer-events-none rotate-12 z-0">
        <img src={doodle1} alt="" className="w-full h-full object-contain rounded-full grayscale" />
      </div>
      <div className="absolute top-[45%] -right-[5%] w-80 h-80 opacity-[0.04] dark:opacity-[0.015] pointer-events-none -rotate-45 z-0">
        <img src={doodle2} alt="" className="w-full h-full object-contain rounded-full grayscale" />
      </div>
      <div className="absolute bottom-[10%] -left-[5%] w-72 h-72 opacity-[0.03] dark:opacity-[0.015] pointer-events-none rotate-90 z-0">
        <img src={doodle2} alt="" className="w-full h-full object-contain rounded-full grayscale" />
      </div>

      {/* Welcome Section */}
      <section className="relative w-full pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-6">
        <div className="max-w-7xl mx-auto">
          <div 
            className="rounded-3xl p-8 md:p-12 shadow-xl border border-[var(--border-primary)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group transition-colors duration-300"
            style={{ background: 'var(--welcome-bg)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 dark:bg-[#8cc63f]/10 rounded-full blur-[80px] group-hover:bg-white/30 dark:group-hover:bg-[#8cc63f]/20 transition-all duration-700"></div>
            <div className="relative z-10 flex-1">
              <h1 className="text-4xl md:text-5xl font-black text-[var(--welcome-text)] mb-3 flex flex-wrap items-center gap-3 transition-colors duration-300">
                Welcome, {currentUser?.name || currentUser?.userName || 'User'} <span className="inline-block origin-[70%_70%] hover:rotate-12 transition-transform duration-300 text-5xl cursor-default">👋</span>
              </h1>
              <p className="text-[var(--welcome-subtext)] text-lg md:text-xl font-medium transition-colors duration-300">
                Ready to check your latest achievements and contest results?
              </p>
            </div>
            <div className="relative z-10 flex-shrink-0">
              {Array.isArray(myResults) && myResults.length > 0 ? (
                <button
                  onClick={() => {
                    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="bg-[var(--welcome-btn-bg)] hover:bg-[var(--welcome-btn-hover)] text-[var(--welcome-btn-text)] px-8 py-4 rounded-xl font-black text-lg uppercase tracking-wider flex items-center gap-3 transition-all shadow-[0_10px_20px_-5px_rgba(140,198,63,0.4)] hover:-translate-y-1 active:scale-95 whitespace-nowrap"
                >
                  View Result
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              ) : (
                <div
                  title="Results will appear here once released by the admin."
                  className="bg-[var(--welcome-no-result-bg)] text-[var(--welcome-text)] px-8 py-4 rounded-xl font-black text-lg uppercase tracking-wider flex items-center gap-3 border border-[var(--welcome-no-result-border)] shadow-inner cursor-not-allowed whitespace-nowrap opacity-90 transition-colors duration-300"
                >
                  No Results Yet
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 1.2 Performance & Leaderboard Section */}
      {Array.isArray(myResults) && myResults.length > 0 && (
        <section id="results-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-20 scroll-mt-24">
          <div className="flex flex-col lg:flex-row gap-12 items-stretch">
            {/* Leaderboard Left Side */}
            <div className="lg:w-2/3 flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600 shadow-sm border border-yellow-100/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21a3.745 3.745 0 0 1-3.068-.63 3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight transition-colors">Performance & Leaderboard</h2>
                  <p className="text-sm text-[var(--text-secondary)] font-medium italic transition-colors">Track your contest achievements and expert feedback</p>
                </div>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x flex-grow">
                {myResults.map((result) => (
                  <div key={result._id} className="min-w-[320px] bg-white rounded-[40px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 snap-start flex flex-col gap-6 relative overflow-hidden group">
                    {/* Rank Bubble */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/5 rounded-full z-0 group-hover:scale-125 transition-transform duration-700"></div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8cc63f] mb-1">{result.contest?.category}</span>
                        <h3 className="font-extrabold text-gray-900 leading-tight">{result.contest?.contestTitle}</h3>
                      </div>
                      <div className={`w-14 h-14 rounded-[22px] flex flex-col items-center justify-center border-2 ${result.rank === '1st' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                        result.rank === '2nd' ? 'bg-gray-50 border-gray-200 text-gray-600' :
                          'bg-purple-50 border-purple-100 text-purple-700'
                        }`}>
                        <span className="text-xl font-black leading-none">{result.rank.replace('st', '').replace('nd', '').replace('rd', '')}</span>
                        <span className="text-[10px] font-black uppercase mt-[-2px]">{result.rank.slice(-2)}</span>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-end justify-between bg-[var(--bg-primary)]/50 p-6 rounded-[32px] border border-[var(--border-primary)]">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Final Score</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-[var(--text-primary)]">{result.score}</span>
                          <span className="text-xs font-bold text-[var(--text-secondary)]">/100</span>
                        </div>
                      </div>
                      <div className="h-10 w-[2px] bg-[var(--border-primary)] hidden sm:block"></div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-2">Judged On</span>
                        <span className="font-bold text-[var(--text-primary)] text-sm">{new Date(result.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Instructor Remarks</p>
                      <p className="text-xs text-gray-500 font-medium italic leading-relaxed">
                        "{result.remarks || 'Excellent participation and effort in the challenge.'}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Quote Card Right Side */}
            <div className="lg:w-1/3 w-full flex flex-col pt-2 md:pt-0">
              <div className="relative h-full flex flex-col group/quote bg-white rounded-[44px] shadow-2xl overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:rotate-1 border border-gray-100">
                <div className="overflow-hidden bg-gray-50 flex items-center justify-center relative h-56">
                  {impactImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out ${impactIdx === idx ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        } group-hover/quote:scale-105`}
                      alt="Contest Challenge"
                    />
                  ))}
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center flex-grow">
                  <p className="text-gray-800 text-base md:text-lg font-bold leading-relaxed italic tracking-wide group-hover/quote:text-[#8cc63f] transition-colors duration-500">
                    "Where code meets creativity, design finds purpose, and ideas grow into digital impact"
                  </p>
                  <div className="w-12 h-1 bg-[#8cc63f] mt-4 rounded-full group-hover/quote:w-20 transition-all duration-500"></div>
                </div>
                {/* Decorative tag */}
                <div className="absolute top-6 left-6 bg-[#8cc63f] text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg z-10">
                  Featured Challenge
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {myInvites.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#fcb900]/20 flex items-center justify-center text-[#fcb900]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fcb900] animate-ping"></span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Pending Invitations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myInvites.map(invite => (
              <div key={invite._id} className="bg-white border-2 border-[#fcb900]/30 rounded-[32px] p-8 shadow-[0_10px_30px_rgba(252,185,0,0.05)] hover:shadow-[0_20px_50px_rgba(252,185,0,0.1)] transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#fcb900]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fcb900]">New Invitation</span>
                    <h3 className="text-2xl font-black text-gray-900 text-left line-clamp-1 group-hover:text-[#fcb900] transition-colors">{invite.team?.teamName || "A Team"}</h3>
                    <p className="text-sm font-bold text-gray-400">From: <span className="text-gray-600">{invite.sender?.userName || "Unknown Leader"}</span></p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#fcb900]/10 text-[#fcb900] flex items-center justify-center flex-shrink-0 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                </div>
                <div className="flex gap-4 relative z-10">
                  <button
                    onClick={async () => {
                      const { success } = await respondToInvite(invite._id, "Accepted");
                      if (success) {
                        setMyInvites(prev => prev.filter(i => i._id !== invite._id));
                        await fetchUserTeams();
                      }
                    }}
                    className="flex-1 py-4 rounded-2xl bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-[#8cc63f] transition-all shadow-xl active:scale-95"
                  >
                    Accept
                  </button>
                  <button
                    onClick={async () => {
                      const { success } = await respondToInvite(invite._id, "Rejected");
                      if (success) {
                        setMyInvites(prev => prev.filter(i => i._id !== invite._id));
                      }
                    }}
                    className="flex-1 py-4 rounded-2xl bg-white text-red-500 border border-red-100 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-50 transition-all active:scale-95"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 1.5 My Teams Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#8cc63f]/20 flex items-center justify-center text-[#8cc63f]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.971 5.971 0 00-.941 3.197m0 0l.001.031c0 .225.012.447.038.666M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5Z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight transition-colors">Active Squads</h2>
            </div>
            <p className="text-[var(--text-secondary)] font-medium transition-colors">Manage your participations and collaborate with teammates.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-full">
              Total: {myTeams.length} Teams
            </span>
          </div>
        </div>

        {myTeams.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {myTeams.map((team) => (
              <div key={team._id} className="bg-[var(--card-bg)] rounded-[44px] p-8 shadow-[var(--card-shadow)] border-2 border-[var(--border-primary)] hover:border-[var(--accent-green)]/30 transition-all duration-500 group relative overflow-hidden flex flex-col w-full md:max-w-[400px]">
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-max ${team.approvalStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                        team.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-[#fcb900]/10 text-[#e6a800]'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${team.approvalStatus === 'Approved' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                          team.approvalStatus === 'Rejected' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-[#fcb900] shadow-[0_0_8px_rgba(252,185,0,0.6)]'
                          }`}></span>
                        Approval: {team.approvalStatus || 'Pending'}
                      </span>
                      {team.approvalStatus === 'Approved' && (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-max ${team.submissionStatus === 'Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {team.submissionStatus || 'Draft'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-[#8cc63f] transition-colors line-clamp-1">{team.teamName}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#8cc63f]/10 group-hover:text-[#8cc63f] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 3.11a14.98 14.98 0 0 0-6.16 12.12c0 1.25.15 2.45.43 3.61l.16.66m11.56-4.02L9.63 15.38" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-6 flex-grow relative z-10">
                  {/* Members */}
                  <div>
                    <div className="flex flex-col gap-2 mb-4 px-1">
                      <p className="text-[11px] font-black uppercase text-[#8cc63f] tracking-[0.15em]">Invite team collaborators</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Squad</span>
                        <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{team.members?.length} / {team.contest?.teamSize || '∞'}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {team.members?.map((m, i) => (
                        <div key={i} title={m.userName} className="relative group/member">
                          <div className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5 hover:border-[#8cc63f]/40 hover:bg-[#8cc63f]/5 transition-all cursor-default shadow-sm group/name">
                            <div className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[10px] font-black text-[#8cc63f] shadow-sm group-hover/name:bg-[#8cc63f] group-hover/name:text-white transition-all">
                              {(m.userName || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[11px] font-bold text-gray-600 group-hover/name:text-gray-900 transition-colors">{m.userName}</span>
                          </div>
                          {m._id === team.leader?._id && (
                            <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-[#fcb900] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}

                      {String(team.leader?._id) === String(currentUser?._id) && (team.members?.length || 0) < (team.contest?.teamSize || 10) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTeamToInvite(team);
                            setIsInviteModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl border-2 border-dashed border-gray-200 flex items-center gap-2 text-gray-400 hover:border-[#8cc63f] hover:bg-[#8cc63f]/5 hover:text-[#8cc63f] transition-all group/invite active:scale-95"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          <span className="text-[11px] font-black uppercase tracking-wider">Invite</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Team Leader Section: Pending Join Requests */}
                  {(String(team.leader?._id || team.leader) === String(currentUser?._id || currentUser?.id)) && (
                    <div className="mt-8 pt-8 border-t border-[var(--border-primary)]/50">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em] flex items-center gap-2">
                             Join Applications
                             <span className="w-1.5 h-1.5 rounded-full bg-[#8cc63f] animate-pulse"></span>
                          </h4>
                          <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1">Review prospective recruits</p>
                        </div>
                        <span className="px-3 py-1 bg-[#8cc63f]/10 text-[#8cc63f] text-[10px] font-black rounded-full uppercase tracking-widest border border-[#8cc63f]/20">
                          {(team.joinRequests?.length || team.requests?.length || team.pendingMembers?.length || 0)} Pending
                        </span>
                      </div>

                      {(team.joinRequests || team.requests || team.pendingMembers)?.length > 0 ? (
                        <div className="space-y-4">
                          {(team.joinRequests || team.requests || team.pendingMembers).map((request, reqIdx) => {
                            const userObj = request.user || (request.sender && typeof request.sender === 'object' ? request.sender : request);
                            const requestEmail = typeof userObj === 'string' ? userObj : (userObj.email || userObj.requestUserEmail);
                            const requestName = typeof userObj === 'string' ? 'New Applicant' : (userObj.userName || userObj.name || 'Anonymous Scout');
                            const requestId = request._id || request.id || (request.sender?._id || request.sender);

                            return (
                              <div key={requestId || reqIdx} className="group p-6 bg-[var(--bg-primary)]/40 rounded-[2rem] border border-[var(--border-primary)]/50 hover:border-[#8cc63f]/30 transition-all shadow-sm">
                                <div className="flex items-start justify-between mb-5">
                                  <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8cc63f] to-[#7ab535] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-[#8cc63f]/20 group-hover:rotate-3 transition-transform">
                                      {requestName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-black text-[var(--text-primary)] text-base group-hover:text-[#8cc63f] transition-colors">{requestName}</div>
                                      <div className="text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 opacity-50">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                        {requestEmail}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex gap-3 mt-4 border-t border-[var(--border-primary)]/30 pt-4">
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      const { success } = await respondToJoinRequest(requestId, 'Accepted');
                                      if (success) fetchUserTeams();
                                    }}
                                    disabled={invLoading}
                                    className="flex-1 py-3 px-4 rounded-xl bg-[#8cc63f] text-white font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8cc63f]/20 disabled:opacity-50"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Accept Request
                                  </button>
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      const { success } = await respondToJoinRequest(requestId, 'Rejected');
                                      if (success) fetchUserTeams();
                                    }}
                                    disabled={invLoading}
                                    className="flex-1 py-3 px-4 rounded-xl bg-red-50 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center justify-center gap-2 disabled:opacity-50"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Decline
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-10 text-center bg-[var(--bg-primary)]/10 rounded-[2.5rem] border border-dashed border-[var(--border-primary)]/40">
                          <div className="w-14 h-14 bg-[var(--bg-primary)]/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border-primary)]/50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7 text-[var(--text-secondary)] opacity-30">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-2.123-7.674 4.125 4.125 0 0 0-4.664-5.076 9.35 9.35 0 0 0-3.959-1.8 9.35 9.35 0 0 0-3.959 1.8 4.125 4.125 0 0 0-4.664 5.076 4.125 4.125 0 0 0-2.123 7.674 9.337 9.337 0 0 0 4.121.952 9.38 9.38 0 0 0 2.625-.372" />
                            </svg>
                          </div>
                          <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-[0.25em] italic">No join requests yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-10 relative z-10 pt-6 border-t border-gray-50">
                  {/* Action Button */}
                  <div className="flex flex-col gap-3">
                    {team.approvalStatus === 'Approved' ? (
                      <button
                        onClick={() => navigate(`/dashboard/submit-project/${team.contest?._id}`, { state: { contest: team.contest, team: team } })}
                        className="w-full py-5 rounded-[22px] bg-gray-900 border-2 border-gray-900 text-white font-black text-[13px] transition-all flex items-center justify-center gap-3 tracking-[0.1em] uppercase hover:bg-white hover:text-gray-900 active:scale-[0.98] shadow-2xl shadow-gray-200 group/btn"
                      >
                        <span>{team.submissionStatus === 'Submitted' ? 'Update Submission' : 'Launch Project'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 transition-transform group-hover/btn:translate-x-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    ) : team.approvalStatus === 'Rejected' ? (
                      <div className="w-full py-5 text-center rounded-[22px] bg-red-50/50 border-2 border-dashed border-red-200 text-red-600 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Squad Rejected
                      </div>
                    ) : (
                      <div className="w-full py-5 text-center rounded-[22px] bg-yellow-50/50 border-2 border-dashed border-yellow-200 text-yellow-600 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(252,185,0,0.6)]"></span>
                        Awaiting Admin Review
                      </div>
                    )}                     {/* Explicitly show Delete Squad for Leader if Pending or Rejected */}
                    {String(team.leader?._id || team.leader) === String(currentUser?._id || currentUser?.id) && team.approvalStatus !== 'Approved' && (
                      <button
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this squad? This is irreversible!")) {
                            const { success } = await deleteTeamByUser(team._id);
                            if (success) fetchUserTeams();
                          }
                        }}
                        className="w-full py-4 rounded-[22px] bg-white border border-red-200 text-red-500 font-bold text-[12px] uppercase tracking-wider hover:bg-red-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Delete Squad
                      </button>
                    )}
                  </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-gray-50 rounded-full group-hover:bg-[#8cc63f]/5 group-hover:scale-150 transition-all duration-700 z-0"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-[50px] p-24 text-center shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No squads assembled yet</h3>
              <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto leading-relaxed px-6">
                Your journey begins with a single step. Explore the categories below and form your first elite team!
              </p>
              <button
                onClick={() => navigate('/contests')}
                className="mt-10 px-10 py-4 rounded-full bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-[#8cc63f] transition-all active:scale-95 shadow-xl shadow-gray-200"
              >
                Discover Contests
              </button>
            </div>
          </div>
        )}
      </section>


      {/* 1.8 Explore Categories Section */}
      <section id="explore-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Specializations</h2>
            </div>
            <p className="text-[#6b7280] font-medium">Jump into a specific domain and find your next challenge.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'MERN', slug: 'mern', image: mernImg, color: 'from-blue-500 to-indigo-600' },
            { name: 'UI/UX DESIGN', slug: 'ui-ux', image: uiuxImg, color: 'from-purple-500 to-fuchsia-600' },
            { name: 'DIGITAL MARKETING', slug: 'digital-marketing', image: dmImg, color: 'from-orange-400 to-red-500' },
            { name: 'WEBSITE DESIGNING', slug: 'website-designing', image: webImg, color: 'from-green-400 to-emerald-600' }
          ].map((cat) => (
            <div
              key={cat.slug}
              onClick={() => navigate(`/contests/category/${cat.slug}`)}
              className="group cursor-pointer select-none outline-none focus:outline-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="bg-[var(--card-bg)] rounded-[40px] overflow-hidden border-2 border-[var(--border-primary)] shadow-[var(--card-shadow)] transition-[transform,box-shadow,border-color] duration-500 hover:border-[var(--accent-green)] hover:shadow-2xl hover:shadow-green-900/5 hover:-translate-y-2 relative flex flex-col h-full outline-none focus:outline-none">
                {/* Card Image Header */}
                <div className="h-48 w-full relative overflow-hidden isolate outline-none">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out transform-gpu pointer-events-none"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20 mix-blend-multiply pointer-events-none`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent pointer-events-none"></div>
                </div>

                <div className="p-8 pt-4 flex flex-col items-center text-center">
                  <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 tracking-tight group-hover:text-[var(--accent-green)] transition-colors uppercase">{cat.name}</h3>
                  <p className="text-[var(--text-secondary)] text-sm font-medium mb-8">Click to view all {cat.name} contests.</p>

                  <div className="flex items-center gap-2 text-[var(--accent-green)] font-black uppercase tracking-widest text-[10px] transform group-hover:translate-x-1 transition-all duration-500">
                    Explore Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

                {/* Abstract decoration */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--accent-green)]/5 rounded-full z-0 group-hover:scale-125 transition-transform duration-700 opacity-50"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <TeamSelectionModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        contestId={selectedContestForTeam?._id}
        contestTitle={selectedContestForTeam?.contestTitle}
        projectType={selectedContestForTeam?.projectType}
        onSuccess={fetchUserTeams}
      />

      {teamToInvite && (
        <InviteModal
          team={teamToInvite}
          isOpen={isInviteModalOpen}
          onClose={() => {
            setIsInviteModalOpen(false);
            setTeamToInvite(null);
            fetchUserTeams();
          }}
        />
      )}


      {/* 3. Bottom CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        {/* Soft floating gradient card block wrapper */}
        <div className="rounded-[40px] bg-[var(--card-bg)] relative overflow-hidden shadow-[var(--card-shadow)] border border-[var(--border-primary)] py-20 px-6 sm:px-12 text-center before:absolute before:inset-0 before:bg-gradient-to-br before:from-[var(--bg-secondary)] before:via-[var(--card-bg)] before:to-[var(--bg-secondary)] before:z-0">

          {/* Abstract green color blobs for depth matching mock */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-green)]/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none z-0"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent-yellow)]/5 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none z-0"></div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-[44px] font-extrabold text-[var(--text-primary)] leading-[1.1] tracking-tight mb-5 transition-colors">
              Ready to showcase your<br />brilliance?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-10 pb-2 transition-colors">
              Join 50,000+ specialists who have accelerated their careers<br className="hidden sm:block" />
              through our competitive learning framework.
            </p>

            <div className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow bg-[var(--input-bg)] border border-[var(--border-primary)] rounded-full px-7 py-4 outline-none text-[15px] font-medium text-[var(--text-primary)] shadow-sm focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[var(--accent-green)]/20 transition-all placeholder:font-normal placeholder:text-[var(--text-secondary)] text-center sm:text-left"
              />
              <button className="bg-[var(--accent-green)] hover:brightness-110 text-white rounded-full px-8 py-4 font-bold text-[15px] shadow-sm tracking-wide whitespace-nowrap transition-all">
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
