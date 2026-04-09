import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

// Local Category Images
import mernImg from '../assets/images/Mern.jpg';
import uiuxImg from '../assets/images/UI-UX.jpg';
import dmImg from '../assets/images/Digital-Marketing.jpg';
import webImg from '../assets/images/Website-Designing.jpg';

// Mock Data for all Contest Categories
const CONTEST_CATEGORIES = [
  {
    title: "MERN CONTEST",
    description: "Build robust full-stack applications using MongoDB, Express, React, and Node.js.",
    color: "from-green-500 to-emerald-700",
    shadow: "shadow-emerald-500/20",
    categoryImage: mernImg,
    contests: [
      {
        id: "mern-1",
        title: "E-Commerce Backend Scaling",
        daysLeft: "3 Days",
        entries: "142 Entries",
        image: mernImg
      },
      {
        id: "mern-2",
        title: "Real-time Chat App",
        daysLeft: "5 Days",
        entries: "86 Entries",
        image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2688&auto=format&fit=crop"
      },
      {
        id: "mern-3",
        title: "Task Management Board",
        daysLeft: "12 Days",
        entries: "34 Entries",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
      },
      {
        id: "mern-4",
        title: "Video Streaming Platform",
        daysLeft: "15 Days",
        entries: "19 Entries",
        image: "https://images.unsplash.com/photo-1588508065123-287b28e0131b?q=80&w=2670&auto=format&fit=crop"
      }
    ]
  },
  {
    title: "WEBSITE DESIGNING CONTEST",
    description: "Create stunning, responsive, and cross-browser compatible frontend web interfaces.",
    color: "from-blue-500 to-indigo-700",
    shadow: "shadow-indigo-500/20",
    categoryImage: webImg,
    contests: [
      {
        id: "web-1",
        title: "Restaurant Menu Redesign",
        daysLeft: "2 Days",
        entries: "210 Entries",
        image: webImg
      },
      {
        id: "web-2",
        title: "Modern SaaS Landing Page",
        daysLeft: "4 Days",
        entries: "115 Entries",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2500&auto=format&fit=crop"
      },
      {
        id: "web-3",
        title: "Interactive Portfolio",
        daysLeft: "8 Days",
        entries: "95 Entries",
        image: "https://images.unsplash.com/photo-1507238692062-5409e6d97c5e?q=80&w=2670&auto=format&fit=crop"
      },
      {
        id: "web-4",
        title: "Educational Hub Frontend",
        daysLeft: "10 Days",
        entries: "45 Entries",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop"
      }
    ]
  },
  {
    title: "UI/UX CONTEST",
    description: "Design intuitive user flows, accessible interfaces, and gorgeous aesthetics.",
    color: "from-purple-500 to-fuchsia-700",
    shadow: "shadow-purple-500/20",
    categoryImage: uiuxImg,
    contests: [
      {
        id: "uiux-1",
        title: "Neurodivergent Learning App",
        daysLeft: "1 Day",
        entries: "340 Entries",
        image: uiuxImg
      },
      {
        id: "uiux-2",
        title: "Fintech Dashboard UI",
        daysLeft: "7 Days",
        entries: "220 Entries",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
      },
      {
        id: "uiux-3",
        title: "Healthcare Booking Flow",
        daysLeft: "14 Days",
        entries: "88 Entries",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2670&auto=format&fit=crop"
      },
      {
        id: "uiux-4",
        title: "Smart Home Controller",
        daysLeft: "20 Days",
        entries: "50 Entries",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2670&auto=format&fit=crop"
      }
    ]
  },
  {
    title: "DIGITAL MARKETING",
    description: "Plan campaigns, analyze metrics, and write copy that drives incredible conversion rates.",
    color: "from-[#fcb900] to-orange-600",
    shadow: "shadow-[#fcb900]/20",
    categoryImage: dmImg,
    contests: [
      {
        id: "dm-1",
        title: "Product Launch Campaign",
        daysLeft: "4 Days",
        entries: "185 Entries",
        image: dmImg
      },
      {
        id: "dm-2",
        title: "Brand Voice Refresh",
        daysLeft: "6 Days",
        entries: "120 Entries",
        image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=2608&auto=format&fit=crop"
      },
      {
        id: "dm-3",
        title: "SEO Optimization Strategy",
        daysLeft: "9 Days",
        entries: "65 Entries",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
      },
      {
        id: "dm-4",
        title: "Social Media 30-Day Plan",
        daysLeft: "11 Days",
        entries: "42 Entries",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop"
      }
    ]
  }
];

export default function ContestsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfcfb] overflow-hidden">
      {/* Dynamic Header Section */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8cc63f]/5 via-transparent to-[#fcb900]/5 z-0"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#8cc63f]/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block bg-white text-[#8cc63f] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            Showcase Your Talent
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.05] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Global Design &<br />Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8cc63f] to-[#6da32e]">Contests</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Compete with the smartest minds, build impressive projects, and elevate your career portfolio with industry-standard challenges.
          </p>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col gap-32">
            {CONTEST_CATEGORIES.map((category, catIdx) => (
              <div key={category.title} className="relative z-10 animate-in fade-in slide-in-from-bottom-10" style={{ animationDelay: `${catIdx * 150}ms` }}>
                
                {/* Category Header */}
                <div className="flex flex-col md:flex-row md:items-stretch justify-between mb-12 border-b border-gray-100 pb-12 gap-10">
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="mb-6 w-16 h-1 bg-gradient-to-r from-[#8cc63f] to-[#fcb900] rounded-full"></div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4 uppercase leading-tight">
                      {category.title}
                    </h2>
                    <p className="text-lg text-gray-400 font-medium max-w-xl leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-10">
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className={`px-10 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest bg-gradient-to-r ${category.color} ${category.shadow} shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 w-max`}
                      >
                        Explore Category
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Category Featured Image */}
                  <div className="hidden lg:block w-1/3 h-64 relative rounded-[40px] overflow-hidden shadow-2xl group/catimg">
                    <img 
                      src={category.categoryImage} 
                      alt={category.title} 
                      className="w-full h-full object-cover group-hover/catimg:scale-110 transition-transform duration-1000"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-40 mix-blend-multiply`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {category.contests.map((contest, index) => (
                    <div 
                      key={contest.id}
                      className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group transition-all duration-300 hover:-translate-y-2 flex flex-col"
                    >
                      {/* Card Image */}
                      <div className="h-48 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gray-900/10 z-10 group-hover:bg-transparent transition-colors duration-300"></div>
                        <img 
                          src={contest.image} 
                          alt={contest.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          loading="lazy"
                        />
                        <div className="absolute top-4 right-4 z-20">
                          <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                            Upcoming
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex flex-col flex-grow relative">
                        <div className="flex-grow">
                          <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-4 group-hover:text-[#8cc63f] transition-colors line-clamp-2">
                            {contest.title}
                          </h3>

                          {/* Stats Row */}
                          <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-6 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{contest.daysLeft} left</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-300">|</div>
                            <div className="flex items-center gap-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                              </svg>
                              <span>{contest.entries}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <button 
                          onClick={() => navigate('/signin')}
                          className="w-full bg-[#8cc63f] hover:bg-[#7db435] text-white py-3 rounded-2xl font-bold text-[13px] tracking-widest uppercase transition-colors shadow-sm focus:ring-4 focus:ring-[#8cc63f]/20 flex justify-center items-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Join Contest
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-[#8cc63f]/10 to-gray-900 z-0"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to prove your skills?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Create an account today and get access to exclusive contests, team collaborations, and expert feedback.</p>
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  );
}
