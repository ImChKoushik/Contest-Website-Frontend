import React from 'react';
import ContestCard from '../components/ContestCard';

export default function UserDashboard() {
  
  // Placeholder images mapped from unsplash matching the theme as closely as possible for high fidelity representation
  const contests = [
    {
      title: "MERN Stack Development",
      category: "Development",
      description: "Build a scalable real-time collaboration tool using MongoDB, Express, React, and Node.js. Focus on performance and...",
      daysLeft: "12 Days Left",
      entries: "245 Entries",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop"
    },
    {
      title: "UI/UX Design",
      category: "Design",
      description: "Redesign the educational experience for neurodivergent learners. Focus on accessibility, empathy, and intuitive...",
      daysLeft: "6 Days Left",
      entries: "189 Entries",
      image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2670&auto=format&fit=crop"
    },
    {
      title: "Digital Marketing",
      category: "Marketing",
      description: "Create a viral launch campaign for an eco-friendly tech startup. Strategize for multi-platform engagement and conversion.",
      daysLeft: "5 Days Left",
      entries: "312 Entries",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-[#fbfcfb] min-h-screen font-sans w-full pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[600px] md:h-[650px] overflow-hidden">
        {/* Deep Green Gradient background & Image Overlay */}
        <div className="absolute inset-0 bg-[#063327]">
          {/* Faint technical image overlay logic (approximating user's dual screens background) */}
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2500&auto=format&fit=crop" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-20 object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#173a20]/95 via-[#0c402b]/80 to-[#107044]/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#fbfcfb]/10 via-transparent to-transparent"></div> {/* Bottom soft fade */}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pb-12">
          {/* Glowing Badge */}
          <div className="bg-[#fcb900] text-gray-900 w-max px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md mb-8 ring-4 ring-[#fcb900]/20">
            NEW CONTESTS LIVE
          </div>
          
          <h1 className="text-white text-5xl md:text-[64px] font-extrabold leading-[1.05] tracking-tight mb-6 max-w-3xl">
            Master Your Craft.<br />
            <span className="text-white/95">Lead the Future.</span>
          </h1>

          <p className="text-[#a4dfbe] font-medium text-lg md:text-xl max-w-2xl leading-relaxed mb-10 drop-shadow-sm">
            Join elite global challenges in technology, design, and marketing. Showcase your skills, win industry recognition, and accelerate your career at Desun Academy.
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

          {/* Simple Slider Indicators */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 px-6">
            <span className="h-1.5 rounded-full w-8 bg-[#fcb900] shadow-[0_0_8px_rgba(252,185,0,0.6)]"></span>
            <span className="h-1.5 rounded-full w-8 bg-white/30 hover:bg-white/50 cursor-pointer transition-colors"></span>
            <span className="h-1.5 rounded-full w-8 bg-white/30 hover:bg-white/50 cursor-pointer transition-colors"></span>
          </div>
        </div>
      </section>


      {/* 2. Active Contests Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-10 relative z-20 pt-20">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="max-w-xl">
            <h2 className="text-[32px] md:text-[38px] font-extrabold text-[#111827] mb-3 tracking-tight">Active Contests</h2>
            <p className="text-[#6b7280] text-[15px] font-medium leading-relaxed">
              Choose your specialization and compete with the brightest minds in the industry.
            </p>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex gap-2.5 mt-6 md:mt-0">
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

        {/* Dynamic Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contests.map((contest, index) => (
            <ContestCard key={index} {...contest} />
          ))}
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
