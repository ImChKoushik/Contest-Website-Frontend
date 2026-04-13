import React from 'react';
import successBg from '../assets/images/success.jpg';

const WhyDesun = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-16 pb-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8cc63f] to-[#5a9c21] mb-12 text-center drop-shadow-sm">
          WHY DESUN ACADEMY
        </h1>
        
        <div className="bg-[var(--card-bg)] rounded-3xl shadow-[var(--card-shadow)] p-8 md:p-12 mb-10 border border-[var(--border-primary)] relative overflow-hidden group hover:shadow-[var(--card-shadow)]/50 transition-all duration-300">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#8cc63f] to-[#fcb900] z-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-green)]/5 rounded-full blur-[80px] z-0 group-hover:bg-[var(--accent-green)]/10 transition-colors"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            
            {/* Text Content */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#fcb900]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Award Winning IT Academy in Kolkata
            </h2>
            
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8 transition-colors">
              At <span className="font-bold text-[#8cc63f]">DESUN Academy</span>, we don't just teach — we transform careers. Based in Kolkata's IT hub, our award-winning academy is known for delivering skill-based, placement-driven training across the most in-demand domains like Full Stack Development, Digital Marketing, UI/UX Design, Graphic Design, and more.
            </p>

            <div className="bg-gradient-to-r from-[var(--accent-green)]/10 to-transparent p-6 rounded-2xl border-l-4 border-[var(--accent-green)] mb-8 relative transition-all">
              <div className="absolute top-4 right-4 opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#8cc63f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143z" />
                </svg>
              </div>
              <p className="text-[17px] text-[var(--text-secondary)] leading-relaxed font-medium transition-colors">
                Recognized by <span className="font-bold text-[var(--text-primary)] transition-colors">TV9 Bangla's Brands of Bengal Awards</span> for Excellence in Job-Oriented IT Education, we offer more than just certifications — we offer a path to real employment. Every course includes live projects, hands-on mentorship, internship opportunities, and <span className="font-extrabold text-[#8cc63f] underline decoration-wavy decoration-[#fcb900]/50 underline-offset-4">100% placement assistance</span>.
              </p>
            </div>

            <p className="text-lg text-[var(--text-secondary)] leading-relaxed transition-colors">
              Whether you're a fresh graduate, career switcher, freelancer, or even a homemaker looking to upskill — <span className="font-bold text-[#8cc63f]">DESUN Academy</span> equips you with the confidence, skills, and portfolio to crack your first (or next) high-paying job.
            </p>
            </div>

            {/* Image Content */}
            <div className="w-full lg:w-5/12 relative group/img">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8cc63f] to-[#fcb900] rounded-3xl rotate-3 scale-105 opacity-20 transition-transform group-hover/img:rotate-6 duration-500"></div>
              <img 
                src={successBg} 
                alt="Success Story" 
                className="relative z-10 w-full h-auto rounded-3xl shadow-xl border-4 border-[var(--bg-secondary)] object-cover hover:scale-[1.02] transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyDesun;
