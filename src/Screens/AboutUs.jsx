import ceoImg from '../assets/images/arghadutta.jpg';
import desunAwardImg from '../assets/images/desun-award.jpg';
import tv9Img from '../assets/images/tv9.jpg';
import zeeGhantaImg from '../assets/images/24ghanta.jpg';
import personImg from '../assets/images/1000146451.png';

// Doodle Images
import doodle1 from '../assets/images/1000146440.jpg';
import doodle2 from '../assets/images/1000146438.webp';

export default function AboutUs() {
  const skills = [
    {
      title: "MERN Stack",
      desc: "Build powerful full-stack applications with the MERN stack and turn your ideas into scalable digital solutions."
    },
    {
      title: "UI/UX Design",
      desc: "Design intuitive and visually stunning user experiences that captivate users and solve real problems creatively."
    },
    {
      title: "Digital Marketing",
      desc: "Master the art of digital marketing to boost brand presence, drive engagement, and achieve measurable growth."
    },
    {
      title: "Web Designing",
      desc: "Craft beautiful and responsive websites that blend creativity with functionality to deliver seamless user journeys."
    },
    {
      title: "Web Development",
      desc: "Develop dynamic and high-performing websites using modern technologies to bring innovative ideas to life."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-x-hidden transition-colors duration-300 relative">
      {/* Background Doodles */}
      <div className="absolute top-[10%] -right-[15%] w-80 h-80 opacity-[0.03] dark:opacity-[0.015] pointer-events-none rotate-12 z-0">
        <img src={doodle1} alt="" className="w-full h-full object-contain rounded-full grayscale" />
      </div>
      <div className="absolute top-[50%] -left-[10%] w-72 h-72 opacity-[0.04] dark:opacity-[0.015] pointer-events-none -rotate-12 z-0">
        <img src={doodle2} alt="" className="w-full h-full object-contain rounded-full grayscale" />
      </div>
      {/* Marquee Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-16">

        {/* Welcome Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight transition-colors">
            Welcome to <span className="text-[var(--accent-green)]">DESUN Academy</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto transition-colors">
            DESUN Academy is your launchpad to a high-paying career in tech, marketing, and design. As an award-winning institute based in Kolkata, we are dedicated to delivering job-oriented, hands-on training across Digital Marketing with AI, MERN Stack Development, and UI/UX with AI — all with <span className="font-bold text-[var(--accent-green)]">100% placement support</span>.
          </p>
        </section>

        {/* Why We Started / CEO Section */}
        <section className="bg-[var(--card-bg)] rounded-3xl p-8 md:p-12 shadow-[var(--card-shadow)] border border-[var(--border-primary)] overflow-hidden relative transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-green)]/5 rounded-bl-full -mr-16 -mt-16"></div>

          <h2 className="text-3xl font-black text-[var(--text-primary)] mb-10 border-l-4 border-[var(--accent-green)] pl-4 relative z-10 transition-colors">Why We Started</h2>

          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start pt-6">
            {/* CEO Headshot as Speaker */}
            <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 relative group order-2 md:order-1">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[var(--accent-green)] to-[var(--accent-green)] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[var(--bg-secondary)] shadow-2xl">
                <img
                  src={ceoImg}
                  alt="Arghya Dutta - CEO"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x400/e2e8f0/64748b?text=Arghya+Dutta";
                  }}
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[var(--text-primary)] text-[var(--bg-primary)] px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase shadow-xl whitespace-nowrap z-20 border border-[var(--border-primary)] text-center leading-tight transition-all">
                <div className="text-[13px] tracking-tight mb-0.5">Arghya Dutta</div>
                <div className="text-[var(--accent-green)] text-[9px] tracking-widest opacity-90 transition-colors">Founder & Creative Director</div>
                <div className="text-[8px] opacity-60 tracking-widest mt-0.5 border-t border-[var(--bg-primary)]/10 pt-1 transition-all">Desun Technology Pvt. Ltd.</div>
              </div>
            </div>

            {/* Comic Speech Bubble */}
            <div className="flex-1 relative order-1 md:order-2 w-full">
              {/* Motion Lines (Top Right) */}
              <div className="absolute -top-6 -right-4 w-12 h-12 opacity-40 transition-colors">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-[var(--text-primary)] stroke-[4] fill-none transition-colors">
                  <path d="M20,20 Q40,10 60,20" />
                  <path d="M30,40 Q50,30 70,40" />
                </svg>
              </div>

              {/* Motion Lines (Top Left) */}
              <div className="absolute -top-8 -left-6 w-12 h-12 opacity-40 -rotate-12 transition-colors">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-[var(--text-primary)] stroke-[4] fill-none transition-colors">
                  <path d="M20,20 Q40,10 60,20" />
                </svg>
              </div>

              {/* The Bubble Container */}
              <div className="relative bg-[var(--bg-secondary)] border-[5px] border-[var(--text-primary)] rounded-[50px] md:rounded-[80px] p-8 md:p-12 shadow-[12px_12px_0_0_rgba(0,0,0,0.05)] dark:shadow-[12px_12px_0_0_rgba(255,255,255,0.05)] min-h-[250px] flex flex-col justify-center overflow-hidden transition-all">
                {/* Halftone Dots Effect (Bottom Right) */}
                <div
                  className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] opacity-[0.08] transition-opacity"
                  style={{
                    backgroundImage: 'radial-gradient(var(--text-primary) 20%, transparent 20%)',
                    backgroundSize: '12px 12px'
                  }}
                ></div>

                {/* Bubble Tail for Desktop (Left) */}
                <div className="hidden md:block absolute bottom-12 -left-8 w-10 h-10 bg-[var(--bg-secondary)] border-l-[5px] border-b-[5px] border-[var(--text-primary)] rotate-[45deg] z-[-1] transition-colors"></div>

                {/* Bubble Tail for Mobile (Bottom) */}
                <div className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-[var(--bg-secondary)] border-r-[5px] border-b-[5px] border-[var(--text-primary)] rotate-[45deg] z-[-1] transition-colors"></div>

                <div className="relative z-10 space-y-4">
                  <h3 className="text-[var(--accent-green)] font-black text-sm uppercase tracking-[0.2em] mb-2 flex items-center gap-2 transition-colors">
                    <span className="w-8 h-[2px] bg-[var(--accent-green)] transition-colors"></span>
                    CEO'S VISION
                  </h3>
                  <blockquote className="text-[var(--text-primary)] text-lg md:text-xl font-bold leading-relaxed italic transition-colors">
                    <span className="text-4xl text-[var(--accent-green)] font-serif mr-2 opacity-40 italic">“</span>
                    When I decided to scale hiring for <span className="text-[var(--accent-green)]">DESUN Technology</span>, I faced a critical lack of qualified candidates. This gap between education and industry reality led me to establish <span className="text-[var(--accent-green)]">DESUN Academy</span> – built at the request of the candidates themselves.
                    <span className="text-4xl text-[var(--accent-green)] font-serif ml-2 opacity-40 italic">”</span>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Skills Marquee Section */}
        <section className="relative h-[300px] md:h-[380px] flex items-center justify-center overflow-hidden rounded-[40px] bg-[var(--card-bg)] border border-[var(--border-primary)] shadow-[var(--card-shadow)] mx-[-10px] sm:mx-0 group transition-all">
          {/* Section Header */}
          <div className="absolute top-5 left-8 z-30 pointer-events-none">
            <p className="text-[10px] md:text-xs font-black text-[var(--accent-green)] uppercase tracking-[0.4em] mb-1 drop-shadow-sm">Desun Presents</p>
            <h3 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] tracking-tighter leading-none transition-colors">
              Learn <span className="text-[var(--accent-green)]">&</span> Earn
            </h3>
            <div className="w-12 h-1 bg-[var(--accent-green)] mt-3 rounded-full"></div>
          </div>

          {/* Background Marquee Layer */}
          <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-auto pt-20 md:pt-24">
            <div className="flex animate-marquee gap-6 md:gap-8 whitespace-nowrap px-8">
              {[...skills, ...skills, ...skills].map((skill, idx) => (
                <div
                  key={idx}
                  className="w-[180px] md:w-[220px] h-[200px] md:h-[240px] flex-shrink-0 rounded-[28px] p-5 flex flex-col justify-end text-white shadow-xl bg-gradient-to-br from-[#f97316] to-[#8cc63f] border border-white/20 transform hover:scale-105 transition-transform duration-500 cursor-default"
                >
                  <div className="absolute top-4 right-6 text-2xl opacity-20 font-black">0{(idx % 5) + 1}</div>
                  <h4 className="text-lg md:text-xl font-black mb-1 tracking-tight drop-shadow-md whitespace-normal leading-tight">{skill.title}</h4>
                  <p className="text-[10px] md:text-xs font-medium leading-relaxed opacity-95 whitespace-normal line-clamp-3">
                    {skill.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Foreground Image Layer (The Man) */}
          <div className="absolute inset-0 flex items-center justify-end pointer-events-none z-20 overflow-visible px-4 md:px-12">
            <div className="relative h-full flex items-center">
              <img
                src={personImg}
                alt="Professional"
                className="h-[105%] md:h-[112%] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] mt-[6%] md:mt-[10%] transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Fade Overlays */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[var(--card-bg)] via-[var(--card-bg)]/80 to-transparent z-10 transition-colors"></div>
          <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[var(--card-bg)] via-[var(--card-bg)]/80 to-transparent z-10 transition-colors"></div>
        </section>

        {/* Story Section */}
        <section className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed bg-[var(--accent-green)]/5 rounded-3xl p-8 md:p-12 border border-[var(--accent-green)]/20 transition-colors">
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
            src={desunAwardImg}
            alt="DESUN Academy Award Ceremony"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/1200x675/e2e8f0/64748b?text=Award+Ceremony";
            }}
          />
        </section>

        {/* Awards Section */}
        <section className="flex flex-col items-center text-center space-y-8 pb-10">
          <button className="px-8 py-4 bg-gradient-to-r from-[#8cc63f] to-[#7ab033] text-white text-xl font-black rounded-full shadow-[0_8px_20px_rgba(140,198,63,0.3)] hover:shadow-[0_12px_25px_rgba(140,198,63,0.4)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider cursor-default">
            Awards and Recognitions
          </button>

          <div className="space-y-6 max-w-3xl bg-[var(--card-bg)] p-8 rounded-2xl shadow-sm border border-[var(--border-primary)] w-full text-left transition-colors">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] border-b border-[var(--border-primary)] pb-4 transition-colors">We are proud to be recognized by:</h3>
            <ul className="space-y-8 pt-2">
              <li className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                <div className="flex-shrink-0 w-24 h-16 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:border-[var(--accent-green)]/30 transition-colors overflow-hidden">
                  <img
                    src={tv9Img}
                    alt="TV9 Bangla Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed transition-colors"><strong className="text-[var(--text-primary)] transition-colors">Brands of Bengal</strong> – TV9 Bangla recognized for Excellence in Job Oriented IT Skills</p>
              </li>
              <li className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                <div className="flex-shrink-0 w-24 h-16 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:border-[var(--accent-green)]/30 transition-colors overflow-hidden">
                  <img
                    src={zeeGhantaImg}
                    alt="Zee 24 Ghanta Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed transition-colors"><strong className="text-[var(--text-primary)] transition-colors">Zee 24 Ghanta, Education Excellence Awards in 2025</strong> – Awarded for Excellence in High Paying Job IT Academy.</p>
              </li>
              <li className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                <div className="flex-shrink-0 w-24 h-16 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 rounded-xl flex items-center justify-center p-2 shadow-sm text-[var(--accent-green)] font-black text-2xl group-hover:bg-[var(--accent-green)]/20 transition-colors">
                  🏆
                </div>
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed transition-colors"><strong className="text-[var(--text-primary)] transition-colors">Bengal Business Excellence 2025</strong> – Awarded Excellence in IT and Skill Development</p>
              </li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
