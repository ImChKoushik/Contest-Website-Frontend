import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ContestCard from '../components/ContestCard';
import useContests from '../hooks/useContests';
import useParticipation from '../hooks/useParticipation';
import { useAuthContext } from '../context/AuthContext';
import useResults from '../hooks/useResults';

export default function UserDashboard() {
  const { user: currentUser } = useAuthContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const { joinContest, fetchMyParticipations, myParticipations, loading: participationLoading } = useParticipation();
  const { fetchMyResults, myResults, loading: resultsLoading } = useResults();

  useEffect(() => {
    fetchMyParticipations();
    fetchMyResults();
  }, []);

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

  const { data, loading, error } = useContests();
  const [selectedCategory, setSelectedCategory] = useState('All');

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

      {/* 1.5 My Participations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Joined Contests</h2>
            </div>
            <p className="text-sm text-gray-400 font-medium italic">Contests you've applied for</p>
          </div>
          <div className="h-px flex-grow mx-8 bg-gray-100 hidden md:block"></div>
        </div>
        
        {myParticipations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myParticipations.map((p) => (
              <div key={p._id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-purple-500/5 transition-all group relative overflow-hidden">
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 3.18a14.98 14.98 0 00-4.97 8.91 14.97 14.97 0 003.57 12.2m12-19.91a6.75 6.75 0 00-5.1-5.1m5.1 5.1a14.98 14.98 0 01-12 12m12-12c-2.1 4.7-6.8 6-12 6" />
                    </svg>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    p.submissionStatus === 'Submitted' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  }`}>
                    {p.submissionStatus || 'Draft'}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-gray-900 line-clamp-1 mb-1 text-lg">{p.contest?.contestTitle || 'Unknown Contest'}</h3>
                <p className="text-[12px] text-gray-400 font-bold mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  {p.contest?.category}
                </p>
                
                <button 
                  onClick={() => navigate(`/dashboard/submit-project/${p.contest?._id}`, { state: { contest: p.contest, participation: p } })}
                  className="w-full py-3.5 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-900 group-hover:bg-gray-900 hover:text-white text-gray-700 font-black text-xs transition-all flex items-center justify-center gap-2 tracking-widest uppercase"
                >
                  {p.submissionStatus === 'Submitted' ? 'Update Submission' : 'Submit Project'}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[32px] p-12 text-center">
            <p className="text-gray-400 font-medium text-sm">You haven't joined any contests yet. Explore below to get started!</p>
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
                  onSuccess={fetchMyParticipations}
                  title={contest.contestTitle}
                  category={contest.category}
                  status={contest.status}
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
