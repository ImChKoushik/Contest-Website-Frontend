import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ContestCard from '../components/ContestCard';
import useContests from '../hooks/useContests';
import useTeam from '../hooks/useTeam';
import TeamSelectionModal from '../components/TeamSelectionModal';
import InviteModal from '../components/InviteModal';
import { useAuthContext } from '../context/AuthContext';
import useResults from '../hooks/useResults';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';

export default function UserDashboard() {
  const { user: currentUser } = useAuthContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const { 
    viewAllTeams, getTeamDetails, getMyTeam, 
    acceptInvite, rejectInvite, acceptRequest, rejectRequest, 
    loading: teamLoading 
  } = useTeam();
  const { fetchMyResults, myResults, loading: resultsLoading } = useResults();
  const { showToast } = useToast();

  const [myTeams, setMyTeams] = useState([]);
  const [selectedContestForTeam, setSelectedContestForTeam] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [teamToInvite, setTeamToInvite] = useState(null);

  const { data, loading, error } = useContests();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchUserTeams = async () => {
    if (!currentUser) return;
    
    if (currentUser.role === 'Admin') {
      const { success, data: allTeams } = await viewAllTeams();
      if (success) setMyTeams(allTeams);
      return;
    }

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

  const slides = [
    {
      badge: "MERN CONTEST",
      titleLine1: "Master Your Craft.",
      titleLine2: "Lead the Future.",
      description: "Build a scalable real-time collaboration tool using MongoDB, Express, React, and Node.js. Focus on performance and architecture.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2500&auto=format&fit=crop"
    },
    {
      badge: "UI/UX CONTEST",
      titleLine1: "Design with Empathy.",
      titleLine2: "Shape Experiences.",
      description: "Redesign the educational experience for neurodivergent learners. Focus on accessibility, empathy, and intuitive interaction.",
      image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2670&auto=format&fit=crop"
    },
    {
      badge: "WEBSITE DESIGNING CONTEST",
      titleLine1: "Build Stunning Web.",
      titleLine2: "Push the Boundaries.",
      description: "Create stunning, responsive, and performant web interfaces. Prove your frontend mastery with modern design architectures.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  const wheelTimeout = useRef(null);
  
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > 20 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (!wheelTimeout.current) {
        if (e.deltaX > 0) {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
        } else {
          setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        }
        wheelTimeout.current = setTimeout(() => {
          wheelTimeout.current = null;
        }, 800);
      }
    }
  };



  // Helper to format deadline
  const getDaysLeft = (deadline) => {
    const d = new Date(deadline);
    const now = new Date();
    const diff = d - now;
    if (diff <= 0) return "Closed";
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} Days Left`;
  };

  // Only show Upcoming and On-Going contests to users
  const visibleContests = useMemo(() => {
    if (!Array.isArray(data?.contests)) return [];
    return data.contests.filter(c => c.status === 'Upcoming' || c.status === 'On-Going');
  }, [data?.contests]);

  // Get unique categories from visible contests only
  const categories = useMemo(() => {
    const cats = visibleContests
      .map(c => c.category)
      .filter((cat, index, self) => cat && self.indexOf(cat) === index);
    return ['All', ...cats];
  }, [visibleContests]);

  // Filter contests based on selected category
  const filteredContests = useMemo(() => {
    if (selectedCategory === 'All') return visibleContests;
    return visibleContests.filter(c => c.category === selectedCategory);
  }, [visibleContests, selectedCategory]);

  // Handle category click from hero badge
  const handleHeroBadgeClick = (categoryName) => {
    // If the badge is like "MERN CONTEST", try to match "MERN"
    const simplifiedCat = categoryName.split(' ')[0].toUpperCase();
    const match = categories.find(c => c.toUpperCase() === simplifiedCat);
    if (match) {
      setSelectedCategory(match);
      // Scroll to contest section
      const contestSection = document.getElementById('active-contests');
      if (contestSection) {
        contestSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };


  return (
    <div className="bg-[#fbfcfb] min-h-screen font-sans w-full pb-20">
      
      {/* 1. Hero Section */}
      <section 
        className="relative w-full h-[600px] md:h-[650px] overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
      >
        {/* Deep Green Gradient background & Image Overlay */}
        <div className="absolute inset-0 bg-[#063327]">
          {/* Faint technical image overlay logic */}
          {slides.map((slide, idx) => (
            <img 
              key={idx}
              src={slide.image} 
              alt={`Slide ${idx + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover object-right transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? "opacity-20 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#173a20]/95 via-[#0c402b]/80 to-[#107044]/60 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#fbfcfb]/10 via-transparent to-transparent z-10"></div> {/* Bottom soft fade */}
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pb-12">
          {/* Glowing Badge */}
          <div 
            onClick={() => handleHeroBadgeClick(slides[currentSlide].badge)}
            className="bg-[#fcb900] text-gray-900 w-max px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm mb-8 ring-4 ring-[#fcb900]/20 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          >
            {slides[currentSlide].badge}
          </div>
          
          <h1 className="text-white text-5xl md:text-[64px] font-extrabold leading-[1.05] tracking-tight mb-6 max-w-3xl transition-all duration-300">
            {slides[currentSlide].titleLine1}<br />
            <span className="text-white/95">{slides[currentSlide].titleLine2}</span>
          </h1>

          <p className="text-[#a4dfbe] font-medium text-lg md:text-xl max-w-2xl leading-relaxed mb-10 drop-shadow-sm transition-all duration-300 h-20 sm:h-auto">
            {slides[currentSlide].description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <button className="bg-[#8cc63f] hover:bg-[#7eb830] transition-colors text-white font-bold py-3.5 px-8 rounded-full shadow-[0_4px_14px_rgba(140,198,63,0.39)] flex items-center justify-center gap-2 group tracking-wide">
              Explore Contests
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-white font-bold py-3.5 px-8 rounded-full tracking-wide">
              Our Success Stories
            </button>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 px-6 z-30">
            {slides.map((_, idx) => (
              <span 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                  currentSlide === idx 
                    ? "w-8 bg-[#fcb900] shadow-[0_0_8px_rgba(252,185,0,0.6)]" 
                    : "w-4 bg-white/30 hover:bg-white/50"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* 1.2 Performance & Leaderboard Section */}
      {Array.isArray(myResults) && myResults.length > 0 && (
         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-20">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600 shadow-sm border border-yellow-100/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21a3.745 3.745 0 0 1-3.068-.63 3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                  </svg>
               </div>
               <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Performance & Leaderboard</h2>
                  <p className="text-sm text-gray-400 font-medium italic">Track your contest achievements and expert feedback</p>
               </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
               {myResults.map((result) => (
                  <div key={result._id} className="min-w-[320px] bg-white rounded-[40px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 snap-start flex flex-col gap-6 relative overflow-hidden group">
                     {/* Rank Bubble */}
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/5 rounded-full z-0 group-hover:scale-125 transition-transform duration-700"></div>
                     
                     <div className="relative z-10 flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#8cc63f] mb-1">{result.contest?.category}</span>
                           <h3 className="font-extrabold text-gray-900 leading-tight">{result.contest?.contestTitle}</h3>
                        </div>
                        <div className={`w-14 h-14 rounded-[22px] flex flex-col items-center justify-center border-2 ${
                           result.rank === '1st' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                           result.rank === '2nd' ? 'bg-gray-50 border-gray-200 text-gray-600' :
                           'bg-purple-50 border-purple-100 text-purple-700'
                        }`}>
                           <span className="text-xl font-black leading-none">{result.rank.replace('st','').replace('nd','').replace('rd','')}</span>
                           <span className="text-[10px] font-black uppercase mt-[-2px]">{result.rank.slice(-2)}</span>
                        </div>
                     </div>

                     <div className="relative z-10 flex items-end justify-between bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Final Score</span>
                           <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black text-gray-900">{result.score}</span>
                              <span className="text-xs font-bold text-gray-400">/100</span>
                           </div>
                        </div>
                        <div className="h-10 w-[2px] bg-gray-200/60 hidden sm:block"></div>
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Judged On</span>
                           <span className="font-bold text-gray-700 text-sm">{new Date(result.createdAt).toLocaleDateString()}</span>
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
               <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Squads</h2>
            </div>
            <p className="text-[#6b7280] font-medium">Manage your participations and collaborate with teammates.</p>
          </div>
          
          <div className="flex items-center gap-2">
             <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-full">
               Total: {myTeams.length} Teams
             </span>
          </div>
        </div>
        
        {myTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {myTeams.map((team) => (
              <div key={team._id} className="bg-white rounded-[44px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 hover:border-[#8cc63f]/20 hover:shadow-[0_20px_50px_rgba(140,198,63,0.08)] transition-all duration-500 group relative overflow-hidden flex flex-col">
                
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-8 relative z-10">
                   <div className="flex flex-col">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 w-max ${
                        team.submissionStatus === 'Submitted' 
                        ? 'bg-[#8cc63f]/10 text-[#8cc63f]' 
                        : 'bg-[#fcb900]/10 text-[#fcb900]'
                      }`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${team.submissionStatus === 'Submitted' ? 'bg-[#8cc63f]' : 'bg-[#fcb900]'}`}></span>
                         {team.submissionStatus || 'Draft In Progress'}
                      </span>
                      <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-[#8cc63f] transition-colors line-clamp-1">{team.teamName}</h3>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#8cc63f]/10 group-hover:text-[#8cc63f] transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 3.11a14.98 14.98 0 0 0-6.16 12.12c0 1.25.15 2.45.43 3.61l.16.66m11.56-4.02L9.63 15.38" />
                      </svg>
                   </div>
                </div>

                <div className="space-y-6 flex-grow relative z-10">
                  {/* Contest Info */}
                  <div className="bg-gray-50/80 rounded-[28px] p-5 border border-gray-100">
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5">Participating In</p>
                     <p className="text-sm font-extrabold text-gray-700 line-clamp-1">{team.contest?.contestTitle}</p>
                     <p className="text-[11px] font-bold text-[#8cc63f] mt-1">{team.contest?.category}</p>
                  </div>

                  {/* Members */}
                  <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                       <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">The Squad</p>
                       <span className="text-[10px] font-black text-gray-400">{team.members?.length} / {team.contest?.teamSize || '∞'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                       {team.members?.map((m, i) => (
                         <div key={i} title={m.userName} className="relative group/member">
                            <div className="w-11 h-11 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-xs font-black text-gray-400 hover:border-[#8cc63f] hover:text-[#8cc63f] transition-all cursor-help shadow-sm overflow-hidden">
                               {m.userName?.substring(0, 2).toUpperCase()}
                            </div>
                            {m._id === team.leader?._id && (
                               <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#fcb900] rounded-full border-2 border-white flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2 h-2">
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
                            className="w-11 h-11 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#8cc63f] hover:bg-[#8cc63f]/5 hover:text-[#8cc63f] transition-all group/invite active:scale-90"
                            title="Invite Team Members"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                             </svg>
                          </button>
                       )}
                    </div>
                  </div>

                  {/* Pending Join Requests (Leader Only) */}
                  {(String(team.leader?._id || team.leader) === String(currentUser?._id || currentUser?.id)) && 
                   (team.joinRequests || team.requests || team.pendingMembers) && 
                   (team.joinRequests?.length > 0 || team.requests?.length > 0 || team.pendingMembers?.length > 0) && (
                    <div className="mt-8 pt-8 border-t-2 border-gray-100/50">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex flex-col">
                           <p className="text-[10px] font-black uppercase text-[#fcb900] tracking-widest flex items-center gap-2 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#fcb900] animate-ping"></span>
                              Join Requests
                           </p>
                           <p className="text-[9px] font-bold text-gray-400">Review prospective teammates</p>
                        </div>
                        <span className="text-[10px] font-black text-[#fcb900] bg-[#fcb900]/10 px-3 py-1 rounded-full border border-[#fcb900]/20">
                          {(team.joinRequests || team.requests || team.pendingMembers).length} Pending
                        </span>
                      </div>
                      <div className="space-y-3">
                        {(team.joinRequests || team.requests || team.pendingMembers).map((request, reqIdx) => {
                          // Backend uses { user: ObjectId } which might be populated
                          const userObj = request.user || request;
                          const requestEmail = typeof userObj === 'string' ? userObj : (userObj.email || userObj.requestUserEmail);
                          const requestName = typeof userObj === 'string' ? 'New Applicant' : (userObj.userName || userObj.name || 'Anonymous Scout');
                          
                          if (!requestEmail) return null;

                          return (
                            <div key={reqIdx} className="flex items-center justify-between bg-yellow-50/40 p-4 rounded-3xl border border-yellow-100/30 group/req hover:bg-yellow-50 hover:border-yellow-200 transition-all">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-2xl bg-white border border-yellow-100 flex items-center justify-center text-xs font-black text-yellow-600 shadow-sm">
                                    {requestName.substring(0, 2).toUpperCase()}
                                 </div>
                                 <div className="flex flex-col">
                                   <span className="text-[13px] font-black text-gray-800">{requestName}</span>
                                   <span className="text-[10px] font-bold text-gray-400">{requestEmail}</span>
                                 </div>
                              </div>
                              <div className="flex gap-2.5">
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const { success } = await acceptRequest(team._id, requestEmail);
                                    if (success) fetchUserTeams();
                                  }}
                                  className="w-10 h-10 rounded-[18px] bg-[#8cc63f] text-white flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-[#8cc63f]/20 active:scale-90"
                                  title="Approve Member"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4.5 h-4.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const { success } = await rejectRequest(team._id, requestEmail);
                                    if (success) fetchUserTeams();
                                  }}
                                  className="w-10 h-10 rounded-[18px] bg-white border-2 border-red-50 text-red-300 flex items-center justify-center hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all active:scale-90"
                                  title="Decline Request"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4.5 h-4.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-10 relative z-10 pt-6 border-t border-gray-50">
                  {/* Action Button */}
                  {team.members?.some(m => m._id === currentUser?._id || m === currentUser?._id) ? (
                    <button 
                      onClick={() => navigate(`/dashboard/submit-project/${team.contest?._id}`, { state: { contest: team.contest, team: team } })}
                      className="w-full py-5 rounded-[22px] bg-gray-900 border-2 border-gray-900 text-white font-black text-[13px] transition-all flex items-center justify-center gap-3 tracking-[0.1em] uppercase hover:bg-white hover:text-gray-900 active:scale-[0.98] shadow-2xl shadow-gray-200 group/btn"
                    >
                      <span>{team.submissionStatus === 'Submitted' ? 'Update Submission' : 'Launch Project'}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 transition-transform group-hover/btn:translate-x-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  ) : (
                    <button 
                      onClick={async () => {
                        const { success } = await acceptInvite(team._id);
                        if (success) fetchUserTeams();
                      }}
                      className="w-full py-5 rounded-[22px] bg-[#8cc63f] text-white font-black text-[13px] uppercase tracking-[0.1em] hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-[#8cc63f]/10"
                    >
                      Accept Squad Invitation
                    </button>
                  )}
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
                 Your journey begins with a single step. Explore the active contests below and form your first elite team!
               </p>
               <button 
                 onClick={() => {
                   const section = document.getElementById('active-contests');
                   if(section) section.scrollIntoView({ behavior: 'smooth' });
                 }}
                 className="mt-10 px-10 py-4 rounded-full bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-[#8cc63f] transition-all active:scale-95 shadow-xl shadow-gray-200"
               >
                 Discover Contests
               </button>
            </div>
          </div>
        )}
      </section>


      {/* 2. Active Contests Section */}
      <section id="active-contests" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-10 relative z-20 pt-20">

        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="max-w-xl">
            <h2 className="text-[32px] md:text-[38px] font-extrabold text-[#111827] mb-3 tracking-tight">Active Contests</h2>
            <p className="text-[#6b7280] text-[15px] font-medium leading-relaxed">
              Choose your specialization and compete with the brightest minds in the industry.
            </p>
          </div>
          
          {/* Pagination/Filter Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 md:mt-0">
            {/* Category Filter Bar */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-[#8cc63f] text-white shadow-[0_4px_12px_rgba(140,198,63,0.3)]"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-[#8cc63f] hover:text-[#8cc63f]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="hidden md:flex gap-2.5 ml-auto">
              <button className="w-[36px] h-[36px] rounded-full border-2 border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-[-1px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button className="w-[36px] h-[36px] rounded-full border-2 border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-[-1px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Card Grid */}
        <div className="min-h-[400px] relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#8cc63f]/20 border-t-[#8cc63f] rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-8 rounded-[32px] text-center border border-red-100 font-medium">
              <p className="mb-2">Oops! Something went wrong while fetching contests.</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          ) : filteredContests.length === 0 ? (
            <div className="bg-gray-50 text-gray-400 p-20 rounded-[32px] text-center border border-gray-100 font-medium flex flex-col items-center gap-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 opacity-20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.14.28a2.25 2.25 0 002.008 1.24h2.464a2.25 2.25 0 002.008-1.24l.14-.28a2.25 2.25 0 012.008-1.24h3.86m-18 0V7.5A2.25 2.25 0 014.5 5.25h15a2.25 2.25 0 012.25 2.25v6.75m-18 0A2.25 2.25 0 002.25 15.75a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25 2.25 2.25 0 00-2.25-2.25H2.25z" />
              </svg>
              <p>No contests found in <span className="text-gray-900 font-bold">"{selectedCategory}"</span> category.</p>
              <button 
                onClick={() => setSelectedCategory('All')}
                className="text-[#8cc63f] font-bold hover:underline"
              >
                Back to All Contests
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContests.map((contest, index) => (
                <ContestCard 
                  key={contest._id || index} 
                  id={contest._id}
                  onApply={() => {
                    setSelectedContestForTeam(contest);
                    setIsTeamModalOpen(true);
                  }}
                  title={contest.contestTitle}
                  category={contest.category}
                  status={contest.status}
                  projectType={contest.projectType}
                  teamSize={contest.teamSize}
                  description={contest.contestDescription}
                  daysLeft={getDaysLeft(contest.contestDeadLine)}
                  entries={`${contest.entryLimit || 100} Entries`}
                  image={contest.category?.toLowerCase().includes('mern') 
                    ? "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop"
                    : contest.category?.toLowerCase().includes('design')
                    ? "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2670&auto=format&fit=crop"
                    : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                  }
                />
              ))}
            </div>
          )}
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
        <div className="rounded-[40px] bg-white relative overflow-hidden shadow-[0_10px_40px_rgba(140,198,63,0.06)] border border-gray-50/50 py-20 px-6 sm:px-12 text-center before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#fcfdfa] before:via-white before:to-[#f3fbdf] before:z-0">
           
           {/* Abstract green color blobs for depth matching mock */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#8cc63f]/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none z-0"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#fcb900]/5 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none z-0"></div>

           <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
             <h2 className="text-4xl md:text-[44px] font-extrabold text-[#1f2937] leading-[1.1] tracking-tight mb-5">
               Ready to showcase your<br />brilliance?
             </h2>
             <p className="text-[#6b7280] text-lg mb-10 pb-2">
               Join 50,000+ specialists who have accelerated their careers<br className="hidden sm:block" />
               through our competitive learning framework.
             </p>

             <div className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="flex-grow bg-white border border-gray-200 rounded-full px-7 py-4 outline-none text-[15px] font-medium text-gray-700 shadow-sm focus:border-[#8cc63f] focus:ring-2 focus:ring-[#8cc63f]/20 transition-all placeholder:font-normal placeholder:text-gray-400 text-center sm:text-left"
               />
               <button className="bg-[#8cc63f] hover:bg-[#7db435] text-white rounded-full px-8 py-4 font-bold text-[15px] shadow-sm tracking-wide whitespace-nowrap transition-colors">
                 Start Your Journey
               </button>
             </div>
           </div>
        </div>
      </section>

    </div>
  );
}
