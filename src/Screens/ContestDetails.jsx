import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useContests from '../hooks/useContests';
import { useAuthContext } from '../context/AuthContext';
import TeamSelectionModal from '../components/TeamSelectionModal';

export default function ContestDetails() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useContests();
  const { user } = useAuthContext();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00', closed: true });

  const contest = useMemo(() => {
    return data?.contests?.find(c => c._id === contestId);
  }, [data?.contests, contestId]);

  useEffect(() => {
    if (!contest?.contestDeadLine) return;
    
    const updateCountdown = () => {
      const diff = new Date(contest.contestDeadLine).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00', closed: true });
        return;
      }
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setTimeLeft({
        d: d.toString().padStart(2, '0'),
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0'),
        closed: false
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [contest?.contestDeadLine]);

  const handleApply = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setIsTeamModalOpen(true);
  };

  const image = useMemo(() => {
    // 1. Priority: Cloudinary Uploaded Image
    if (contest?.contestImage?.url) return contest.contestImage.url;
    
    // 2. Fallback: Category-based Unsplash imagery
    const cat = contest?.category?.toLowerCase() || "";
    if (cat.includes('mern'))
      return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop";
    if (cat.includes('design') || cat.includes('ui'))
      return "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2670&auto=format&fit=crop";
    if (cat.includes('marketing'))
      return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop";
    if (cat.includes('web'))
      return "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2670&auto=format&fit=crop";
      
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2670&auto=format&fit=crop";
  }, [contest]);

  return (
    <div className="bg-[#f4f7f4] min-h-screen pb-24 font-sans">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-12 h-12 border-4 border-[#8cc63f]/20 border-t-[#8cc63f] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Challenge...</p>
        </div>
      ) : error || !contest ? (
        <div className="flex flex-col items-center justify-center py-40 max-w-lg mx-auto text-center px-6">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Contest Not Found</h2>
          <p className="text-gray-500 mb-8">{error || "The contest you are looking for does not exist or has been removed."}</p>
          <button onClick={() => navigate(-1)} className="px-8 py-3 bg-[#8cc63f] text-white rounded-full font-bold shadow-sm hover:bg-[#7ab033] transition-colors">
            Go Back
          </button>
        </div>
      ) : (
        <>
          {/* Hero Banner */}
          <div className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden bg-[#063327]">
            <img src={image} alt={contest.contestTitle} className="w-full h-full object-cover mix-blend-overlay opacity-50" />
            
            {/* Glossy Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#063327] via-transparent to-[#8cc63f]/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#f4f7f4] via-transparent to-transparent opacity-90 h-full"></div>

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-white hover:text-[#8cc63f] transition-all font-bold text-sm uppercase tracking-widest z-20 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/20 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              Go Back
            </button>

            {/* Top Right Badges */}
            <div className="absolute top-8 right-6 md:right-12 z-20 flex gap-3">
              <div className="bg-black/40 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${contest.projectType === 'Team' ? 'bg-[#3b82f6] text-[#3b82f6]' : contest.projectType === 'Both' ? 'bg-orange-500 text-orange-500' : 'bg-[#8cc63f] text-[#8cc63f]'}`}></span>
                {contest.projectType === 'Both' ? 'Solo & Team' : contest.projectType || 'Individual'}
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                {contest.category}
              </div>
            </div>

            {/* Title Content */}
            <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-16 z-20">
              <div className="max-w-6xl mx-auto container">
                <div className="inline-block px-4 py-1.5 bg-[#8cc63f]/20 border border-[#8cc63f]/50 text-[#8cc63f] font-bold text-xs uppercase tracking-widest rounded-full mb-6 backdrop-blur-md">
                  Official Challenge
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl mb-2">
                  {contest.contestTitle}
                </h1>
                <p className="text-xl md:text-2xl text-white/70 font-medium tracking-wide mt-4">
                  Prove your skills. Compete with the best. Walk away victorious.
                </p>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-30 mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

              {/* Sidebar Info (Timer & Action) - 4 Cols */}
              <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
                
                {/* Premium Live Timer Card */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_20px_40px_-15px_rgb(0,0,0,0.05)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8cc63f]/10 rounded-full blur-3xl"></div>
                  
                  <div className="text-center mb-8 relative z-10">
                    <span className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] mb-1 block">Time Remaining</span>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      {timeLeft.closed ? 'Contest Ended' : 'Hurry up!'}
                    </h2>
                  </div>

                  {!timeLeft.closed ? (
                    <div className="grid grid-cols-4 gap-3 text-center mb-8 relative z-10">
                      {[
                        { label: 'DAYS', value: timeLeft.d },
                        { label: 'HOURS', value: timeLeft.h },
                        { label: 'MINS', value: timeLeft.m },
                        { label: 'SECS', value: timeLeft.s }
                      ].map((time, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-full aspect-square bg-[#063327] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-inner border border-green-900/50 tabular-nums">
                            {time.value}
                          </div>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">{time.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-rose-50 text-rose-500 font-bold p-6 rounded-2xl text-center mb-8 border border-rose-100">
                      The deadline has passed for this contest. Keep an eye out for future events!
                    </div>
                  )}

                  {/* Dynamic Action Button */}
                  <div className="relative z-10">
                    {contest.status === 'On-Going' && !timeLeft.closed ? (
                      <button
                        onClick={handleApply}
                        className="w-full py-4.5 bg-gradient-to-r from-[#8cc63f] to-[#7ab033] text-white rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-[0_10px_20px_-5px_rgba(140,198,63,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(140,198,63,0.5)] active:scale-95 flex items-center justify-center gap-2"
                      >
                        Enter Challenge Now
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    ) : (
                      <button disabled className="w-full py-4.5 bg-gray-100 text-gray-400 rounded-full font-black text-sm uppercase tracking-widest cursor-not-allowed">
                        {contest.status === 'Upcoming' ? 'Opening Soon' : 'Submissions Closed'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_20px_40px_-15px_rgb(0,0,0,0.05)]">
                  <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest border-b border-gray-100 pb-4">Key Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                        Capacity
                      </span>
                      <span className="text-sm font-black text-gray-900">{contest.entryLimit || 100} Slots</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.971 5.971 0 00-.941 3.197m0 0l.001.031c0 .225.012.447.038.666M12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12 6.75a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg>
                        Model
                      </span>
                      <span className="text-sm font-black text-gray-900">
                        {contest.projectType === 'Both' ? 'Hybrid (Solo + Team)' : contest.projectType} 
                        {['Team', 'Both'].includes(contest.projectType) && ` (Max ${contest.teamSize})`}
                      </span>
                    </div>
                    
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                        End Date
                      </span>
                      <span className="text-sm font-black text-gray-900 text-right max-w-[120px]">
                        {new Date(contest.contestDeadLine).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Main Content Area - 8 Cols */}
              <div className="lg:col-span-8 order-2 lg:order-1 pt-4 space-y-6">
                {/* Challenge Brief Card */}
                <div className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-[0_20px_40px_-15px_rgb(0,0,0,0.05)]">
                  <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div className="w-12 h-12 bg-[#8cc63f]/10 rounded-2xl flex items-center justify-center text-[#8cc63f]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">Challenge Brief</h3>
                      <p className="text-gray-400 font-medium text-sm">Everything you need to know about this contest.</p>
                    </div>
                  </div>

                  <div className="prose prose-lg text-gray-600 leading-loose max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:font-medium prose-a:text-[#8cc63f] prose-li:marker:text-[#8cc63f]">
                    <p className="whitespace-pre-wrap">{contest.contestDescription}</p>
                  </div>

                  {/* PDF Download */}
                  {contest.contestPDF?.url && (
                    <a
                      href={contest.contestPDF.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 flex items-center justify-between w-full p-4 rounded-2xl bg-red-50 border border-red-100 hover:bg-red-100 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-black text-red-700 uppercase tracking-wider">Contest Brief PDF</p>
                          <p className="text-[10px] text-red-500/70 font-medium truncate max-w-[150px]">
                            {contest.contestPDF.fileName || 'View / Download Brief'}
                          </p>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-red-500 group-hover:translate-y-0.5 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </a>
                  )}

                </div>

                {/* Rule Sections Card */}
                {contest.ruleSections?.length > 0 && (
                  <div className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-[0_20px_40px_-15px_rgb(0,0,0,0.05)]">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                      <div className="w-12 h-12 bg-[#fcb900]/10 rounded-2xl flex items-center justify-center text-[#fcb900]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Contest Rules</h3>
                        <p className="text-gray-400 font-medium text-sm">Guidelines and requirements all participants must follow.</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {contest.ruleSections.map((section, sIdx) => (
                        <div key={sIdx}>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="w-7 h-7 rounded-full bg-[#8cc63f]/10 text-[#8cc63f] font-black text-[11px] flex items-center justify-center flex-shrink-0">
                              {sIdx + 1}
                            </span>
                            <h4 className="text-lg font-black text-gray-900 tracking-tight">{section.title}</h4>
                          </div>
                          <ul className="space-y-3 ml-10">
                            {section.points?.filter(p => p.trim()).map((point, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-3 text-gray-600 font-medium">
                                <span className="w-5 h-5 rounded-full bg-[#8cc63f]/10 border border-[#8cc63f]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-[#8cc63f]">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                  </svg>
                                </span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>


          {/* Modal */}
          <TeamSelectionModal
            isOpen={isTeamModalOpen}
            onClose={() => setIsTeamModalOpen(false)}
            contestId={contest._id}
            contestTitle={contest.contestTitle}
            projectType={contest.projectType}
          />
        </>
      )}
    </div>
  );
}
