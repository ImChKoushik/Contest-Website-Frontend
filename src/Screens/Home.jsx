import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import heroImg from '../resources/hero.png';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const categories = [
    { name: 'MERN', slug: 'mern', icon: 'M', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop' },
    { name: 'UI/UX DESIGN', slug: 'ui-ux', icon: 'U', color: 'bg-purple-50 text-purple-600', border: 'border-purple-100', image: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2670&auto=format&fit=crop' },
    { name: 'DIGITAL MARKETING', slug: 'digital-marketing', icon: 'D', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop' },
    { name: 'WEB DESIGNING', slug: 'web-designing', icon: 'W', color: 'bg-green-50 text-green-600', border: 'border-green-100', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop' }
  ];

  const handleCategoryClick = (slug) => {
    if (!user) {
      navigate('/signin');
    } else {
      navigate(`/contests/category/${slug}`);
    }
  };

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
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#fca311] text-black text-xs font-bold uppercase tracking-wider mb-8 shadow-lg transition-all duration-500 animate-fade-in">
              New Contests Live
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 transition-all duration-700 animate-slide-up">
              Master Your Craft.<br />
              <span className="text-[#8cc63f]">Lead the Future.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-100/90 mb-10 max-w-xl leading-relaxed transition-all duration-700 delay-100 animate-slide-up">
              Join elite global challenges in technology, design, and marketing.
              Showcase your skills, win industry recognition, and accelerate your career at Desun Academy.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/contests')}
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

        {/* Carousel Dots - Kept for aesthetics or removed? 
            Original code had dots. I'll restore the original dots layout. */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          <div className="w-10 h-1.5 rounded-full bg-[#fca311]"></div>
          <div className="w-10 h-1.5 rounded-full bg-white/30"></div>
          <div className="w-10 h-1.5 rounded-full bg-white/30"></div>
        </div>
      </section>

      {/* Explore Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Explore <span className="text-[#8cc63f]">Categories</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">
              Filter challenges by your expertise. Deep dive into specialized contests and showcase your mastery in specific domains.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div 
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-[40px] p-8 border-2 border-gray-50 shadow-sm transition-all duration-500 hover:border-[#8cc63f] hover:shadow-2xl hover:shadow-green-900/5 hover:-translate-y-2 relative overflow-hidden flex flex-col items-center">
                   <div className={`w-16 h-16 ${cat.color} ${cat.border} border-2 rounded-[24px] flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      {cat.icon}
                   </div>
                   <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-[#8cc63f] transition-colors">{cat.name}</h3>
                   <p className="text-gray-400 text-sm font-medium mb-8">Click to view all {cat.name} contests.</p>
                   
                   <div className="flex items-center gap-2 text-[#8cc63f] font-black uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                      Explore Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                   </div>
                   
                   {/* Abstract decoration */}
                   <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-50 rounded-full z-0 group-hover:scale-125 transition-transform duration-700 opacity-50"></div>
                </div>
              </div>
            ))}
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
