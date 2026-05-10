import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from './Button';
import { useAuthContext } from '../context/AuthContext';
import { useLogout } from '../hooks/useLogout';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import logo from '../assets/images/logo.png';
import DefaultProfile from '../assets/images/DefaultProfile.png';
import UpdateProfileModal from './UpdateProfileModal';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, tokenExpired, login } = useAuthContext();
  const { logout, loading } = useLogout();
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (!user || tokenExpired) return;

    const updateTimer = () => {
      const loginTime = parseInt(localStorage.getItem('loginTime') || '0', 10);
      if (!loginTime) {
        setTimeLeft(15 * 60);
        return;
      }
      const elapsed = Math.floor((Date.now() - loginTime) / 1000);
      const remaining = Math.max(0, 15 * 60 - elapsed);
      setTimeLeft(remaining);

      // Auto-expire session precisely when timer hits 0
      if (remaining === 0) {
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [user, tokenExpired]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Silently refresh access token and re-login
  const handleSilentReAuth = async () => {
    if (refreshing) return;
    setRefreshing(true);

    try {
      console.log("--- ATOMIC RENEWAL START ---");

      // 1. Activate Crisis Lock & Clear stale state
      localStorage.setItem('session_crisis', 'true');
      localStorage.removeItem('authToken');

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        showToast("Storage error: Refresh token missing.", "error");
        handleLogout();
        navigate('/signin');
        return;
      }

      console.log(`DIAGNOSTIC: Attempting renewal...`);

      // 2. Use NATIVE FETCH for isolation
      const BASE_URL = 'https://contest-backend-td3m.onrender.com/api/v1';
      const timestamp = Date.now();

      const response = await window.fetch(`${BASE_URL}/user/generate-access?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      console.log("DIAGNOSTIC: SERVER RESPONSE:", data);

      if (!response.ok) {
        if (response.status === 401) {
          showToast("Session fully expired. Please log in again.", "error");
          handleLogout();
          navigate('/signin');
        } else {
          showToast(data.message || "Renewal failed.", "warning");
        }
        return;
      }

      const newToken = data?.data?.accessToken || data?.accessToken;
      const newRefreshToken = data?.data?.refreshToken || data?.refreshToken;

      if (!newToken) throw new Error("No access token received.");

      // 3. SAVE IMMEDIATELY & Clear Crisis Lock
      localStorage.setItem('authToken', newToken);
      if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.removeItem('session_crisis');

      console.log("RENEWAL SUCCESS: Syncing profile...");

      // 4. Sync User Profile (Crisis is over, can use axiosInstance now)
      const res = await axiosInstance.get(`/user/me?t=${timestamp}`);
      const userData = res.data?.user || res.data?.data?.user;

      if (userData) {
        login(userData, newToken, newRefreshToken || refreshToken);
        showToast("Session renewed! Welcome back.", "success");
      }
    } catch (err) {
      console.error("RENEWAL EXCEPTION:", err.message);
      showToast("System error during renewal.", "warning");
    } finally {
      setRefreshing(false);
      localStorage.removeItem('session_crisis'); // Safety fallback
      closeMenu();
      console.log("--- ATOMIC RENEWAL END ---");
    }
  };

  const displayName = user?.userName || user?.name || user?.email?.split('@')[0] || 'User';

  const baseLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contests', path: '/contests' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Dynamically calculate navigation links based on user role
  const navLinks = user?.role === 'Admin'
    ? baseLinks.filter(link => link.name !== 'Contests').concat({ name: 'Admin Portal', path: '/admin-dashboard' })
    : user
      ? [...baseLinks, { name: 'Candidate Portal', path: '/dashboard' }]
      : [...baseLinks];

  return (
    <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl sticky top-0 z-50 py-1.5 border-b border-[var(--border-primary)] shadow-[0_2px_15px_-3px_rgba(140,198,63,0.07)] transition-colors duration-300">
      {/* Animated Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--accent-green)]/5 to-[var(--bg-secondary)] animate-navbar-gradient -z-10"></div>

      {/* Shimmering Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-[#8cc63f]/30 to-transparent animate-border-shimmer"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 group relative z-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex flex-col items-start lg:items-center">
              <img src={logo} alt="Desun Academy" className="h-[28px] md:h-[32px] lg:h-[34px] w-auto object-contain" />
              <div className="flex items-center gap-1 mt-[-2px]">
                <span className="text-[10px] md:text-[11px] lg:text-[12px] font-black bg-gradient-to-r from-[#8cc63f] to-[#5a8624] bg-clip-text text-transparent tracking-tighter drop-shadow-sm">
                  Desun's LearnAndEarn
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[12px] h-[12px] md:w-[14px] text-[#fcb900] drop-shadow-sm mb-[2px]">
                  <path fillRule="evenodd" d="M5.166 2.621v.92h13.668v-.92c0-.218-.02-.43-.053-.639C18.666 1.053 17.842 0 16.984 0H7.016C6.158 0 5.334 1.053 5.219 1.982a3.97 3.97 0 0 0-.053.639Zm14.165 2.67H4.669a2.25 2.25 0 0 0-2.25 2.25v2.625a6.002 6.002 0 0 0 5.438 5.972l.4 5.8H6.5a.75.75 0 0 0 0 1.5h11a.75.75 0 0 0 0-1.5h-1.772l.4-5.8a6.002 6.002 0 0 0 5.438-5.972V6.79a2.25 2.25 0 0 0-2.25-2.25Zm-1.5 2.25v2.625a4.5 4.5 0 0 1-3.69 4.426l-.37 5.37H10.24l-.37-5.37a4.5 4.5 0 0 1-3.69-4.426V6.79h11.281Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 px-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[12px] xl:text-[13px] font-bold transition-all relative group py-1 tracking-wide whitespace-nowrap ${isActive ? 'nav-link-active' : 'text-gray-500 nav-link-green-light'
                    }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-[#8cc63f] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(140,198,63,0.8)] ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}></span>
                </Link>
              );
            })}
          </nav>

          {!user && (
            <Link to="/why-desun" className="hidden lg:flex px-4 py-2 rounded-full border-2 border-[#8cc63f]/50 text-[#8cc63f] hover:bg-[#8cc63f] hover:border-[#8cc63f] hover:text-white text-[12px] font-black uppercase tracking-wider transition-all shadow-sm items-center gap-2 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Our Success Story
            </Link>
          )}

          {/* Auth/Profile & Hamburger Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {tokenExpired ? (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500 pr-2">
                  <div className="flex flex-col items-end mr-1">
                    <span className="text-[10px] text-amber-600 font-black uppercase tracking-widest leading-none mb-1">Session Expired</span>
                    <span className="text-[11px] text-[var(--text-secondary)] font-bold leading-none opacity-60">Restore Access Now</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                    <button
                      onClick={handleSilentReAuth}
                      disabled={refreshing}
                      className="group relative flex items-center justify-center h-10 px-5 bg-gradient-to-r from-[#fcb900] to-[#ff9900] text-white rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(252,185,0,0.2)] hover:shadow-[0_6px_20px_rgba(252,185,0,0.3)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                    >
                      <span className="relative flex items-center gap-2 text-[12px] font-black uppercase tracking-wider">
                        {refreshing ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                        )}
                        {refreshing ? 'Renewing...' : 'Renew Session'}
                      </span>
                    </button>
                    <div className="w-px h-6 bg-amber-500/20 mx-1"></div>
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="h-10 px-4 text-[12px] font-black text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 uppercase tracking-wider"
                    >
                      {loading ? '...' : 'Logout'}
                    </button>
                  </div>
                </div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  {/* JWT Countdown Badge */}
                  <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${timeLeft < 60 ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' : 'bg-[#8cc63f]/10 border-[#8cc63f]/30 text-[#8cc63f]'} shadow-sm transition-colors duration-300`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="text-[12px] font-black tracking-widest">{formatTime(timeLeft)}</span>
                  </div>

                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isNotifOpen ? 'bg-[var(--accent-green)] text-white shadow-lg' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                      </svg>
                      {/* Badge (Pulsing Effect) */}
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-[var(--bg-secondary)] rounded-full animate-bounce"></span>
                    </button>

                    <NotificationDropdown
                      isOpen={isNotifOpen}
                      onClose={() => setIsNotifOpen(false)}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center pr-1.5 pl-1.5 py-1.5 bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] rounded-full border border-[var(--border-primary)] shadow-sm transition-all cursor-default group">
                      <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm transform group-hover:rotate-12 transition-transform border border-[var(--accent-green)]/30">
                        <img
                          src={user?.profileImage?.url || DefaultProfile}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = DefaultProfile; }}
                        />
                      </div>
                      <div className="flex flex-col ml-2.5 pr-1 text-left">
                        <span className="text-[10px] font-bold text-[var(--accent-green)] uppercase tracking-widest leading-none mb-0.5 transition-colors">Welcome</span>
                        <span className="font-extrabold text-[var(--text-primary)] text-[13px] leading-none tracking-tight transition-colors">{displayName}</span>
                      </div>
                      <button
                        onClick={() => setIsProfileModalOpen(true)}
                        title="Edit Profile"
                        className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] group-hover:bg-[var(--accent-green)] text-[var(--text-secondary)] group-hover:text-white flex items-center justify-center transition-all shadow-sm ml-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="px-5 h-10 rounded-full bg-[var(--bg-secondary)] border-2 border-red-500/10 hover:border-red-500 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 shadow-sm text-[13px] font-black uppercase tracking-wider"
                    >
                      {loading ? '...' : 'Logout'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/signin')} className="px-5 py-2.5 text-[13px] font-bold text-gray-600 hover:text-[#8cc63f] transition-colors tracking-wide">Sign In</button>
                  <button onClick={() => navigate('/signup')} className="px-6 py-2.5 text-[13px] font-black bg-[#8cc63f] hover:bg-[#7ab033] text-white rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(140,198,63,0.3)] hover:shadow-lg hover:-translate-y-0.5 uppercase tracking-wider">Sign Up</button>
                </div>
              )}
              <ThemeToggle />
            </div>

            {/* Mobile Actions Section */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMenu}
                className={`lg:hidden p-2.5 rounded-xl border border-[var(--accent-green)]/20 bg-[var(--bg-secondary)]/50 backdrop-blur-sm transition-all duration-300 ${isMenuOpen ? 'bg-[var(--accent-green)]/10 border-[var(--accent-green)] rotate-180' : 'hover:bg-[var(--bg-secondary)]'}`}
                aria-label="Toggle menu"
              >
                <div className={`hamburger-box ${isMenuOpen ? 'hamburger-open' : ''}`}>
                  <span className="hamburger-inner"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-x-0 top-[64px] md:top-[70px] bg-[var(--bg-secondary)]/95 backdrop-blur-2xl border-b border-[var(--accent-green)]/20 transition-all duration-500 ease-in-out z-40 lg:hidden overflow-y-auto ${isMenuOpen ? 'h-[calc(100vh-64px)] md:h-[calc(100vh-70px)] opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="px-6 py-8 space-y-6">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link, idx) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className={`text-[17px] font-extrabold transition-all flex items-center justify-between group ${isActive ? 'nav-link-active' : 'text-[var(--text-primary)] nav-link-green-light'
                    }`}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  {link.name}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 text-[#8cc63f] transition-all drop-shadow-[0_0_8px_rgba(140,198,63,0.6)] ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                    }`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              );
            })}

            {/* Theme Toggle in Mobile Menu */}
            <div className="flex items-center justify-between p-3.5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] transition-colors mt-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-wider">Interface Mode</span>
                <span className="text-[10px] text-[var(--text-secondary)] font-bold">Light or Dark vision</span>
              </div>
              <ThemeToggle />
            </div>
          </nav>

          {!user && (
            <Link to="/why-desun" onClick={closeMenu} className="flex mt-6 justify-center items-center w-full py-3.5 text-[14px] font-black bg-gradient-to-r from-[#8cc63f]/10 to-[#8cc63f]/5 text-[#8cc63f] border border-[#8cc63f]/30 rounded-2xl transition-all uppercase tracking-wider gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Our Success Story
            </Link>
          )}

          <div className="pt-6 border-t border-[var(--border-primary)] flex flex-col gap-4">
            {!tokenExpired && user && (
              <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${timeLeft < 60 ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' : 'bg-[#8cc63f]/10 border-[#8cc63f]/30 text-[#8cc63f]'} shadow-sm transition-colors duration-300`}>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-wider">Active Session</span>
                  <span className="text-[10px] font-bold opacity-80">Time until protection lock</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-[15px] font-black tracking-widest">{formatTime(timeLeft)}</span>
                </div>
              </div>
            )}

            {tokenExpired ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-5 bg-amber-500/5 border-2 border-amber-500/20 rounded-3xl text-center">
                  <span className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] mb-3 block">Security Alert: Session Expired</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      onClick={handleSilentReAuth}
                      disabled={refreshing}
                      className="w-full py-3.5 text-[13px] font-black bg-gradient-to-r from-[#fcb900] to-[#ff9900] text-white rounded-2xl shadow-lg shadow-amber-200 uppercase tracking-wider flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                    >
                      {refreshing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Syncing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4.5 h-4.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                          Renew Session
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="w-full py-3 text-[13px] font-black bg-red-50 text-red-600 rounded-2xl border border-red-100 uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      {loading ? '...' : 'Logout'}
                    </button>
                  </div>
                </div>
              </div>
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] group transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden shadow-md border-2 border-[var(--accent-green)]/30">
                      <img
                        src={user?.profileImage?.url || DefaultProfile}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = DefaultProfile; }}
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold text-[var(--accent-green)] uppercase tracking-widest leading-none mb-1">Signed In</span>
                      <span className="font-extrabold text-[var(--text-primary)] text-sm transition-colors">{displayName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setIsNotifOpen((prev) => !prev)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isNotifOpen ? 'bg-[#8cc63f] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-400'
                          }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border border-white rounded-full animate-bounce"></span>
                      </button>
                    </div>
                    <button
                      onClick={() => { setIsProfileModalOpen(true); closeMenu(); }}
                      className="w-9 h-9 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--accent-green)] hover:border-[var(--accent-green)] flex items-center justify-center transition-all shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-3.5 text-[13px] font-black bg-red-50 text-red-600 rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { navigate('/signin'); closeMenu(); }}
                  className="w-full py-4 text-[14px] font-bold text-[var(--text-primary)] bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-primary)] transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { navigate('/signup'); closeMenu(); }}
                  className="w-full py-4 text-[14px] font-black bg-[#8cc63f] text-white rounded-2xl shadow-[0_8px_20px_rgba(140,198,63,0.3)] uppercase tracking-wider"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isProfileModalOpen && (
        <UpdateProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      )}
    </header>
  );
}
