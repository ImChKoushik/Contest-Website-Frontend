import React from 'react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#fbfcfb] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Welcome Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Welcome to <span className="text-[#8cc63f]">DESUN Academy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            DESUN Academy is your launchpad to a high-paying career in tech, marketing, and design. As an award-winning institute based in Kolkata, we are dedicated to delivering job-oriented, hands-on training across Digital Marketing with AI, MERN Stack Development, and UI/UX with AI — all with <span className="font-bold text-[#8cc63f]">100% placement support</span>.
          </p>
        </section>

        {/* Why We Started / CEO Section */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-8 border-l-4 border-[#8cc63f] pl-4">Why We Started</h2>
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <h3 className="font-bold text-gray-900 text-xl">From Our CEO:</h3>
            <blockquote className="italic border-l-4 border-gray-200 pl-6 space-y-4 text-gray-600">
              <p>
                “When I decided to scale hiring for DESUN Technology Private LTD, where we work on various software development and web development work, I faced the challenge of massive of lack of qualified candidates in the market.
              </p>
              <p>
                At one time we had to reject 99% of the Interview Candidates during a Hiring Drive consisting of all BTech, MCA, MTech, BCA, Candidates. This led me to believe that the skill gap between traditional education and what is required in the real world has grown to critical levels to the point I am simply not getting qualified candidates for IT. I am sure other companies are facing the same issue.
              </p>
              <p className="font-semibold text-gray-800">
                At the request of many such candidates, I established DESUN Academy.”
              </p>
            </blockquote>
          </div>
        </section>

        {/* Story Section */}
        <section className="space-y-6 text-lg text-gray-700 leading-relaxed bg-[#8cc63f]/5 rounded-3xl p-8 md:p-12 border border-[#8cc63f]/20">
          <p>
            Founded by real industry professionals from DESUN Technology, we were built to bridge the ever-growing gap between what companies need and what colleges teach. Every course is crafted to provide practical, portfolio-worthy skills, taught by mentors with 9+ years of real-world experience.
          </p>
          <p>
            With live projects, industry tools, internships, and career grooming, our mission is to create work-ready professionals, not just certificate holders.
          </p>
        </section>

        {/* Image before Award Section */}
        {/* Note: User must supply this image at this path or it will fallback to a visual placeholder */}
        <section className="rounded-3xl overflow-hidden shadow-xl aspect-video bg-gray-100 border border-gray-200 relative group">
          <img 
            src="/src/assets/images/desun award.jpg" 
            alt="DESUN Academy Award Ceremony" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/1200x675/e2e8f0/64748b?text=Please+save+your+image+as+src/assets/images/desun+award.jpg";
            }}
          />
        </section>

        {/* Awards Section */}
        <section className="flex flex-col items-center text-center space-y-8 pb-10">
          <button className="px-8 py-4 bg-gradient-to-r from-[#8cc63f] to-[#7ab033] text-white text-xl font-black rounded-full shadow-[0_8px_20px_rgba(140,198,63,0.3)] hover:shadow-[0_12px_25px_rgba(140,198,63,0.4)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider cursor-default">
            Awards and Recognitions
          </button>
          
          <div className="space-y-6 max-w-3xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full text-left">
            <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">We are proud to be recognized by:</h3>
            <ul className="space-y-8 pt-2">
              <li className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                <div className="flex-shrink-0 w-24 h-16 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:border-[#8cc63f]/30 transition-colors overflow-hidden">
                  <img 
                    src="/src/assets/images/tv9.jpg" 
                    alt="TV9 Bangla Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <p className="text-gray-700 text-lg leading-relaxed"><strong className="text-gray-900">Brands of Bengal</strong> – TV9 Bangla recognized for Excellence in Job Oriented IT Skills</p>
              </li>
              <li className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                <div className="flex-shrink-0 w-24 h-16 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:border-[#8cc63f]/30 transition-colors overflow-hidden">
                  <img 
                    src="/src/assets/images/24ghanta.jpg" 
                    alt="Zee 24 Ghanta Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <p className="text-gray-700 text-lg leading-relaxed"><strong className="text-gray-900">Zee 24 Ghanta, Education Excellence Awards in 2025</strong> – Awarded for Excellence in High Paying Job IT Academy.</p>
              </li>
              <li className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                <div className="flex-shrink-0 w-24 h-16 bg-[#8cc63f]/10 border border-[#8cc63f]/20 rounded-xl flex items-center justify-center p-2 shadow-sm text-[#8cc63f] font-black text-2xl group-hover:bg-[#8cc63f]/20 transition-colors">
                  🏆
                </div>
                <p className="text-gray-700 text-lg leading-relaxed"><strong className="text-gray-900">Bengal Business Excellence 2025</strong> – Awarded Excellence in IT and Skill Development</p>
              </li>
            </ul>
          </div>
        </section>
        
      </div>
    </div>
  );
}
