import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import heroImg from '../resources/hero.png';

// Local Category Images
import mernImg from '../assets/images/Mern.jpg';
import uiuxImg from '../assets/images/UI-UX.jpg';
import dmImg from '../assets/images/Digital-Marketing.jpg';
import webImg from '../assets/images/Website-Designing.jpg';

// Slider Images
import bannerSliderImg from '../assets/images/BannerSlider.jpg';
import mernHomeImg from '../assets/images/mernHome.jpg';
import learningImg from '../assets/images/learning.jpg';

// Welcome Gallery Images
import galleryImg1 from '../assets/images/IMG-20251102-WA0017.jpg';
import galleryImg2 from '../assets/images/IMG-20250905-WA0011.jpg';
import galleryImg3 from '../assets/images/IMG_20260413_121254.jpg';
import galleryImg4 from '../assets/images/IMG_20260413_121238.jpg';

// Doodle Images
import doodle1 from '../assets/images/1000146440.jpg';
import doodle2 from '../assets/images/1000146438.webp';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedText, setTypedText] = useState('');
  const fullWelcomeText = "Welcome to Desun's Learn and earn contest";
  const typingSpeed = 100;

  useEffect(() => {
    let i = 0;
    let timeoutId;
    let intervalId;

    const runAnimation = () => {
      i = 0;
      intervalId = setInterval(() => {
        setTypedText(fullWelcomeText.slice(0, i));
        i++;
        if (i > fullWelcomeText.length) {
          clearInterval(intervalId);
          timeoutId = setTimeout(runAnimation, 2000);
        }
      }, typingSpeed);
    };

    runAnimation();
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const slides = [
    {
      badge: "MERN CONTEST",
      titleLine1: "Master Your Craft.",
      titleLine2: "Lead the Future.",
      description: "Build a scalable real-time collaboration tool using MongoDB, Express, React, and Node.js. Focus on performance and architecture.",
      image: bannerSliderImg
    },
    {
      badge: "UI/UX CONTEST",
      titleLine1: "Design with Empathy.",
      titleLine2: "Shape Experiences.",
      description: "Redesign the educational experience for neurodivergent learners. Focus on accessibility, empathy, and intuitive interaction.",
      image: mernHomeImg
    },
    {
      badge: "WEBSITE DESIGNING CONTEST",
      titleLine1: "Build Stunning Web.",
      titleLine2: "Push the Boundaries.",
      description: "Create stunning, responsive, and performant web interfaces. Prove your frontend mastery with modern design architectures.",
      image: learningImg
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  // Interaction handlers (Touch/Wheel)
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const wheelTimeout = useRef(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) setCurrentSlide((prev) => (prev + 1) % slides.length);
    else if (distance < -50) setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > 20 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (!wheelTimeout.current) {
        if (e.deltaX > 0) setCurrentSlide((prev) => (prev + 1) % slides.length);
        else setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 relative overflow-hidden">
      {/* Background Doodles */}
      <div className="absolute top-[15%] -left-[5%] w-64 h-64 opacity-[0.03] dark:opacity-[0.02] pointer-events-none rotate-12 z-0">
        <img src={doodle1} alt="" className="w-full h-full object-contain rounded-full grayscale" />
      </div>
      <div className="absolute top-[40%] -right-[5%] w-72 h-72 opacity-[0.04] dark:opacity-[0.02] pointer-events-none -rotate-12 z-0">
        <img src={doodle2} alt="" className="w-full h-full object-contain rounded-full grayscale" />
      </div>
      <div className="absolute bottom-[20%] -left-[3%] w-56 h-56 opacity-[0.03] dark:opacity-[0.02] pointer-events-none rotate-45 z-0">
        <img src={doodle2} alt="" className="w-full h-full object-contain rounded-full grayscale" />
      </div>

      {/* Hero Section */}
      <section
        className="relative h-[85vh] flex items-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 bg-[#063327]">
          {/* Slider Image Overlay */}
          {slides.map((slide, idx) => (
            <img
              key={idx}
              src={slide.image}
              alt={`Slide ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? "opacity-30 z-10" : "opacity-0 z-0"
                }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#173a20]/95 via-[#0c402b]/80 to-[#107044]/60 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/10 via-transparent to-transparent z-10"></div> {/* Bottom soft fade */}
        </div>

        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-3xl">
            {/* Magical Live Status (All Slides) */}
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8cc63f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8cc63f]"></span>
              </div>
              <div className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(140,198,63,0.3)] flex items-center gap-2 group cursor-pointer hover:bg-white/20 transition-all active:scale-95" onClick={() => navigate(user ? '/contests' : '/signin')}>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8cc63f] animate-pulse">
                  Contests are Live
                </span>
                <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors">Apply Now</span>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#fca311] text-black text-xs font-bold uppercase tracking-wider mb-8 shadow-lg transition-all duration-300">
              {slides[currentSlide].badge}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 transition-all duration-300">
              {slides[currentSlide].titleLine1}<br />
              <span className="text-[#8cc63f]">{slides[currentSlide].titleLine2}</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-100/90 mb-10 max-w-xl leading-relaxed transition-all duration-300">
              {slides[currentSlide].description}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/contests')}
                className="bg-[#8cc63f] hover:bg-[#7ab033] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-[0_10px_20px_-5px_rgba(140,198,63,0.4)] hover:-translate-y-1 cursor-pointer relative z-50"
              >
                Explore Contests
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Indicators (Green Light Effect) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-30">
          {slides.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="group cursor-pointer py-4 flex flex-col items-center"
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${currentSlide === idx
                  ? "w-12 bg-[#8cc63f] shadow-[0_0_15px_rgba(140,198,63,0.8),0_0_5px_rgba(140,198,63,1)] scale-110"
                  : "w-6 bg-white/20 group-hover:bg-white/40"
                  }`}
              ></div>
              {currentSlide === idx && (
                <div className="absolute -bottom-1 w-6 h-1 bg-[#8cc63f]/50 blur-sm rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* New Welcome Gallery Section */}
      <section className="py-24 bg-[var(--bg-secondary)] overflow-hidden transition-colors">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Typing Text */}
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-[#8cc63f] text-[10px] font-black uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8cc63f] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8cc63f]"></span>
                </span>
                Official Announcement
              </div>
              <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-orange-500 via-[#8cc63f] to-[#5a8624] bg-clip-text text-transparent leading-[1.1] mb-8 min-h-[120px] md:min-h-[180px]">
                {typedText}
                <span className="animate-pulse text-[#8cc63f]">|</span>
              </h2>
              
              {/* Green Theme Accent (Geometric Shapes) */}
              <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8cc63f] to-[#5a8624] w-3/4 rounded-full shadow-[0_0_15px_rgba(140,198,63,0.5)]"></div>
              </div>
              
              <p className="text-gray-500 text-lg font-medium max-w-lg leading-relaxed mb-8">
                Witness the moments of excellence and collaboration from our recent sessions. Join the community where learning meets earning.
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={galleryImg1} className="w-full h-full object-cover" alt="User" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-300 overflow-hidden shadow-sm">
                    <img src={galleryImg2} className="w-full h-full object-cover" alt="User" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-[#8cc63f] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    +50k
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-gray-200"></div>
                <div>
                  <p className="text-[var(--text-primary)] font-black text-xl leading-none transition-colors">Global Reach</p>
                  <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest mt-1 italic transition-colors">Active Participants</p>
                </div>
              </div>
            </div>

            {/* Right Column: Swipeable Gallery */}
            <div className="relative">
              {/* Decorative background blur */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#8cc63f]/10 rounded-full blur-[100px]"></div>
              
              <div className="flex gap-6 overflow-x-auto pb-10 pt-4 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing">
                {[galleryImg1, galleryImg2, galleryImg3, galleryImg4].map((img, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-[280px] md:w-[350px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-green-900/10 snap-center transform hover:scale-[1.02] transition-all duration-500 border-4 border-white"
                  >
                    <img src={img} alt={`Gallery ${index+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              
              {/* Swipe Instruction */}
              <div className="flex justify-center mt-2">
                <div className="px-6 py-2 rounded-full bg-white border border-gray-100 shadow-sm flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 animate-bounce-x">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                  </svg>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Swipe to explore</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 animate-bounce-x-reverse">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Motivation & Rewards Section */}
      <section className="py-24 relative overflow-hidden transition-colors">
        <div className="container mx-auto px-6">
          <div className="bg-[var(--card-bg)] rounded-[3rem] border border-[var(--border-primary)] shadow-[var(--card-shadow)] overflow-hidden relative group">
            {/* Background Texture/glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-green)]/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              {/* Text Side */}
              <div className="p-10 md:p-16 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[10px] font-black uppercase tracking-widest mb-8 animate-bounce-slow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  Reward Pools Active
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] leading-tight mb-8 transition-colors">
                  Show your skill, <br />
                  <span className="text-[var(--accent-green)] italic">Redefine</span> your future.
                </h2>

                <div className="space-y-6 mb-10">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#8cc63f] flex items-center justify-center text-white shadow-lg shadow-[#8cc63f]/20">
                      <span className="text-xl font-black">₹</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-[var(--text-primary)] mb-1">Win up to ₹10,000 Cash</h4>
                      <p className="text-[var(--text-secondary)] font-medium">Top performers in every specialization win direct prize money credited instantly.</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--accent-green)] shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-[var(--text-primary)] mb-1">Exclusive Interview Scopes</h4>
                      <p className="text-[var(--text-secondary)] font-medium">Selected projects and runners-up get shortlisted for technical interviews and professional mentorship.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/contests')}
                  className="px-10 py-5 bg-[#8cc63f] hover:bg-[#7ab033] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#8cc63f]/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                >
                  Submit Your Project
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>

              {/* Image Side */}
              <div className="relative h-full min-h-[400px] lg:min-h-[600px] bg-gray-900 overflow-hidden">
                <img 
                  src={doodle2} 
                  alt="Motivation" 
                  className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[var(--card-bg)]"></div>
                
                {/* Floating highlight */}
                <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/20 animate-float text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#8cc63f] flex items-center justify-center text-white">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                       </svg>
                    </div>
                    <div>
                      <p className="text-white font-black text-lg leading-tight tracking-tight">Showcase & Succeed</p>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Join the community of achievers</p>
                    </div>
                  </div>
                </div>

                {/* Visual accents */}
                <div className="absolute top-10 right-10 w-24 h-24 border-2 border-white/20 rounded-full animate-spin-slow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Categories Section */}
      <section className="py-20 bg-[var(--bg-primary)] transition-colors">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-16">
            <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tight uppercase transition-colors">Explore <span className="text-[var(--accent-green)]">Categories</span></h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto font-medium transition-colors">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent"></div>
                  </div>

                  <div className="p-8 pt-4 flex flex-col items-center text-center">
                    <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 tracking-tight group-hover:text-[var(--accent-green)] transition-colors uppercase">{cat.name}</h3>
                    <p className="text-[var(--text-secondary)] text-sm font-medium mb-8">Click to view all {cat.name} contests.</p>

                    <div className="flex items-center gap-2 text-[var(--accent-green)] font-black uppercase tracking-widest text-[10px] transform group-hover:translate-x-1 transition-all duration-500">
                      Explore Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
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
      <div className="max-w-6xl mx-auto rounded-[3rem] bg-[var(--card-bg)] p-12 md:p-20 text-center relative overflow-hidden border border-[var(--border-primary)] shadow-[var(--card-shadow)] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[var(--bg-secondary)] before:via-[var(--card-bg)] before:to-[var(--bg-secondary)] before:z-0">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-6 transition-colors">
              Ready to showcase your<br />brilliance?
            </h2>
            <p className="text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto text-lg leading-relaxed transition-colors">
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
