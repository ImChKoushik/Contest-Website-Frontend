import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Contests() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const categories = [
    { name: 'MERN', slug: 'mern', icon: 'M', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { name: 'UI/UX DESIGN', slug: 'ui-ux', icon: 'U', color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
    { name: 'DIGITAL MARKETING', slug: 'digital-marketing', icon: 'D', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
    { name: 'WEBSITE DESIGNING', slug: 'website-designing', icon: 'W', color: 'bg-green-50 text-green-600', border: 'border-green-100' }
  ];

  const handleCategoryClick = (slug) => {
    if (!user) {
      navigate('/signin');
    } else {
      navigate(`/contests/category/${slug}`);
    }
  };

  return (
    <div className="bg-[#fbfcfb] min-h-screen pb-24">
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
               className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:border-[#8cc63f] hover:shadow-xl hover:shadow-green-900/5 transition-all cursor-pointer group flex flex-col items-center text-center"
             >
                <div className={`w-14 h-14 ${cat.color} ${cat.border} border-2 rounded-2xl flex items-center justify-center text-xl font-black mb-6 group-hover:scale-110 transition-transform`}>
                   {cat.icon}
                </div>
                <h3 className="font-black text-gray-900 mb-1 group-hover:text-[#8cc63f] transition-colors">{cat.name}</h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Browse Quests</p>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}
