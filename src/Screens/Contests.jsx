import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// Local Category Images
import mernImg from '../assets/images/Mern.jpg';
import uiuxImg from '../assets/images/UI-UX.jpg';
import dmImg from '../assets/images/Digital-Marketing.jpg';
import webImg from '../assets/images/Website-Designing.jpg';

export default function Contests() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const categories = [
    { name: 'MERN', slug: 'mern', image: mernImg, color: 'from-blue-500 to-indigo-600' },
    { name: 'UI/UX DESIGN', slug: 'ui-ux', image: uiuxImg, color: 'from-purple-500 to-fuchsia-600' },
    { name: 'DIGITAL MARKETING', slug: 'digital-marketing', image: dmImg, color: 'from-orange-400 to-red-500' },
    { name: 'WEBSITE DESIGNING', slug: 'website-designing', image: webImg, color: 'from-green-400 to-emerald-600' }
  ];

  const handleCategoryClick = (slug) => {
    if (!user) {
      navigate('/signin');
    } else {
      navigate(`/contests/category/${slug}`);
    }
  };

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen pb-24 transition-colors duration-300">
      <div className="bg-[#063327] py-20 px-6 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 via-transparent to-transparent opacity-30"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Contest <span className="text-[#8cc63f]">Categories</span>
          </h1>
          <p className="text-[#a4dfbe] text-lg max-w-2xl mx-auto font-medium">
            Jump into a specific domain and find your next challenge. Prove your skills and collaborate with elite peers.
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
              <div
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className="group cursor-pointer"
              >
                <div className="bg-[var(--card-bg)] rounded-[40px] overflow-hidden border-2 border-[var(--border-primary)] shadow-[var(--card-shadow)] transition-all duration-500 hover:border-[var(--accent-green)] hover:shadow-2xl hover:shadow-green-900/5 hover:-translate-y-2 relative flex flex-col h-full">
                  {/* Card Image Header */}
                  <div className="h-48 w-full relative overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20 mix-blend-multiply`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent transition-colors"></div>
                  </div>

                  <div className="p-8 pt-4 flex flex-col items-center text-center">
                    <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 tracking-tight group-hover:text-[var(--accent-green)] transition-all uppercase">{cat.name}</h3>
                    <p className="text-[var(--text-secondary)] text-sm font-medium mb-8 transition-colors">Click to view all {cat.name} contests.</p>

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
    </div>
  );
}
