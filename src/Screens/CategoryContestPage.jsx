import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContestCard from '../components/ContestCard';
import useContests from '../hooks/useContests';
import TeamSelectionModal from '../components/TeamSelectionModal';
import { useAuthContext } from '../context/AuthContext';

const CategoryContestPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useContests();
  const { user } = useAuthContext();
  const [selectedContestForTeam, setSelectedContestForTeam] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Map slugs to display names if necessary
  const categoryMap = {
    'mern': 'MERN',
    'ui-ux': 'UI/UX DESIGN',
    'digital-marketing': 'DIGITAL MARKETING',
    'website-designing': 'WEBSITE DESIGNING'
  };

  const displayName = categoryMap[categorySlug?.toLowerCase()] || categorySlug;

  const filteredContests = useMemo(() => {
    if (!data?.contests) return [];
    return data.contests.filter(c => {
      if (!c.category || !displayName) return false;
      const cleanDB = c.category.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanDisplay = displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanDB === cleanDisplay &&
        ['Upcoming', 'On-Going', 'Completed', 'Complete', 'Closed'].includes(c.status);
    });
  }, [data?.contests, displayName]);

  const getDaysLeft = (deadline) => {
    const d = new Date(deadline);
    const now = new Date();
    const diff = d - now;
    if (diff <= 0) return "Closed";
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} Days Left`;
  };

  const handleApply = (contest) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setSelectedContestForTeam(contest);
    setIsTeamModalOpen(true);
  };

  return (
    <div className="bg-[#fbfcfb] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#063327] py-20 px-6 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 via-transparent to-transparent opacity-30"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            {displayName} <span className="text-[#8cc63f]">Contests</span>
          </h1>
          <p className="text-[#a4dfbe] text-lg max-w-2xl font-medium">
            Explore challenges in {displayName} and prove your skills against the best in the industry.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-[#8cc63f]/20 border-t-[#8cc63f] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading {displayName} Challenges...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-8 rounded-[32px] text-center border border-red-100 font-medium max-w-2xl mx-auto">
            <p className="mb-2">Failed to load contests. Please try again later.</p>
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="bg-white text-gray-400 p-20 rounded-[40px] text-center border border-gray-100 font-medium flex flex-col items-center gap-6 max-w-3xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-xl text-gray-900 font-black">No active contests in {displayName}</p>
            <p className="text-sm max-w-sm">We're currently preparing new challenges for this category. Stay tuned!</p>
            <button
              onClick={() => navigate('/contests')}
              className="text-[#8cc63f] font-black uppercase tracking-widest text-xs hover:underline"
            >
              View All Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContests.map((contest) => (
              <ContestCard
                key={contest._id}
                id={contest._id}
                title={contest.contestTitle}
                category={contest.category}
                description={contest.contestDescription}
                status={contest.status}
                projectType={contest.projectType}
                teamSize={contest.teamSize}
                deadline={contest.contestDeadLine}
                entries={`${contest.entryLimit || 100} Slots`}
                onApply={() => handleApply(contest)}
                image={contest.contestImage}
              />
            ))}
          </div>
        )}
      </div>

      <TeamSelectionModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        contestId={selectedContestForTeam?._id}
        contestTitle={selectedContestForTeam?.contestTitle}
        projectType={selectedContestForTeam?.projectType}
      />
    </div>
  );
};

export default CategoryContestPage;
