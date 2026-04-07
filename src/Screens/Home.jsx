import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ContestCard from '../components/ContestCard';
import useContests from '../hooks/useContests';
import heroImg from '../resources/hero.png';

const Home = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useContests();

  const getDaysLeft = (deadline) => {
    const d = new Date(deadline);
    const now = new Date();
    const diff = d - now;
    if (diff <= 0) return "Closed";
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} Days Left`;
  };

  const visibleContests = useMemo(() => {
    if (!Array.isArray(data?.contests)) return [];
    // Only show active/upcoming contests and limit to top 3 for landing page
    return data.contests
      .filter(c => c.status === 'Upcoming' || c.status === 'On-Going')
      .slice(0, 3);
  }, [data?.contests]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#fca311] text-black text-xs font-bold uppercase tracking-wider mb-8 shadow-lg">
              New Contests Live
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Master Your Craft.<br />
              <span className="text-[#8cc63f]">Lead the Future.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-100/90 mb-10 max-w-xl leading-relaxed">
              Join elite global challenges in technology, design, and marketing.
              Showcase your skills, win industry recognition, and accelerate your career at Desun Academy.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="bg-[#8cc63f] hover:bg-[#7ab033] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-[0_10px_20px_-5px_rgba(140,198,63,0.4)] hover:-translate-y-1"
              >
                Explore Contests
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                Our Success Stories
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          <div className="w-10 h-1.5 rounded-full bg-[#fca311]"></div>
          <div className="w-10 h-1.5 rounded-full bg-white/30"></div>
          <div className="w-10 h-1.5 rounded-full bg-white/30"></div>
        </div>
      </section>

      {/* Active Contests Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Contests</h2>
              <p className="text-gray-500">Choose your specialization and compete with the brightest minds in the industry.</p>
            </div>
            <div className="flex gap-3">
              <div className="hidden sm:flex gap-2">
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-900 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-900 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-[400px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#8cc63f]/20 border-t-[#8cc63f] rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500 font-medium">
                Failed to load contests. Please try again later.
              </div>
            ) : visibleContests.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-medium bg-white rounded-3xl border-2 border-dashed border-gray-100">
                No active contests available right now. Stay tuned!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleContests.map((contest) => (
                  <ContestCard 
                    key={contest._id}
                    id={contest._id}
                    title={contest.contestTitle}
                    category={contest.category}
                    description={contest.contestDescription}
                    status={contest.status}
                    projectType={contest.projectType}
                    teamSize={contest.teamSize}
                    daysLeft={getDaysLeft(contest.contestDeadLine)}
                    entries={`${contest.entryLimit || 100} Slots`}
                    image={contest.category?.toLowerCase().includes('mern') 
                      ? "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop"
                      : "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2670&auto=format&fit=crop"
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto rounded-[3rem] bg-gradient-to-br from-[#f0f9e6] via-white to-[#f0f9e6] p-12 md:p-20 text-center relative overflow-hidden border border-[#8cc63f]/10 shadow-2xl shadow-green-900/5">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Ready to showcase your<br />brilliance?
            </h2>
            <p className="text-gray-500 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              Join 50,000+ specialists who have accelerated their careers through our competitive learning framework.
            </p>

            <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-8 py-5 rounded-2xl bg-white border border-gray-200 outline-none focus:border-[#8cc63f] transition-all shadow-sm"
              />
              <button className="bg-[#8cc63f] hover:bg-[#7ab033] text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#8cc63f]/30">
                Start Your Journey
              </button>
            </div>
          </div>

          {/* Abstract background blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8cc63f]/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#fca311]/5 rounded-full blur-[100px]"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
