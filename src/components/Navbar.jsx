import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from './Button';
import { useAuthContext } from '../context/AuthContext';
import { useLogout } from '../hooks/useLogout';
import axiosInstance from '../utils/axiosInstance';
import logo from '../assets/images/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, tokenExpired, login } = useAuthContext();
  const { logout, loading } = useLogout();
  const [refreshing, setRefreshing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Silently refresh access token and re-login
  const handleSilentReAuth = async () => {
    setRefreshing(true);
    try {
      let refreshRes;
      try {
        // Backend defines this as GET; axiosInstance sends Bearer + x-refresh-token header automatically
        refreshRes = await axiosInstance.get('/user/generate-access');
      } catch (err) {
        // Fallback to refresh-token if generate-access 404s
        if (err.response?.status === 404) {
          refreshRes = await axiosInstance.get('/user/refresh-token');
        } else {
          throw err;
        }
      }

      const newToken =
        refreshRes.data?.data?.accessToken ||
        refreshRes.data?.accessToken ||
        refreshRes.data?.token ||
        refreshRes.data?.data?.token ||
        null;

      const res = await axiosInstance.get('/user/me');
      const userData = res.data?.user || res.data?.data?.user;
      
      if (userData) {
        // Update both user and token in localStorage. 
        // Passing null for newToken (if not found in response) will clear the stale one.
        login(userData, newToken);
        if (userData.role === 'Admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // Refresh token also expired — redirect to sign in
      navigate('/signin');
    } finally {
      setRefreshing(false);
      closeMenu();
    }
  };

  const displayName = user?.userName || user?.name || user?.email?.split('@')[0] || 'User';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contests', path: '/contests' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 py-1.5 border-b border-[#8cc63f]/10 shadow-[0_2px_15px_-3px_rgba(140,198,63,0.07)]">
      {/* Animated Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-[#8cc63f]/5 to-white animate-navbar-gradient -z-10"></div>
      
      {/* Shimmering Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-[#8cc63f]/30 to-transparent animate-border-shimmer"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" onClick={closeMenu} className="flex items-center transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <img src={logo} alt="Desun Academy" className="h-10 md:h-11 w-auto object-contain" />
          </Link>
          
          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-9">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className="text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-all relative group py-1 tracking-wide"
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-[#8cc63f] rounded-full transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
          
          {/* Auth/Profile & Hamburger Section */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {tokenExpired ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                    Session expired
                  </span>
                  <button
                    onClick={handleSilentReAuth}
                    disabled={refreshing}
                    className="px-6 py-2.5 text-[13px] font-black bg-[#8cc63f] hover:bg-[#7ab033] text-white rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(140,198,63,0.3)] hover:shadow-lg hover:-translate-y-0.5 uppercase tracking-wider"
                  >
                    {refreshing ? 'Reconnecting...' : 'Refresh Token'}
                  </button>
                </div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5 bg-gray-50/80 hover:bg-white pl-1.5 pr-4 py-1.5 rounded-full border border-gray-100 shadow-sm transition-all cursor-default group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8cc63f] to-[#7ab033] text-white flex items-center justify-center font-black text-[13px] shadow-sm transform group-hover:rotate-12 transition-transform">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#8cc63f] uppercase tracking-widest leading-none mb-0.5">Welcome</span>
                      <span className="font-extrabold text-gray-800 text-[13px] leading-none tracking-tight">{displayName}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    disabled={loading}
                    className="px-5 h-10 rounded-full bg-white border-2 border-red-500/10 hover:border-red-500 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 shadow-sm text-[13px] font-black uppercase tracking-wider"
                  >
                    {loading ? '...' : 'Logout'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/signin')} className="px-5 py-2.5 text-[13px] font-bold text-gray-600 hover:text-[#8cc63f] transition-colors tracking-wide">Sign In</button>
                  <button onClick={() => navigate('/signup')} className="px-6 py-2.5 text-[13px] font-black bg-[#8cc63f] hover:bg-[#7ab033] text-white rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(140,198,63,0.3)] hover:shadow-lg hover:-translate-y-0.5 uppercase tracking-wider">Sign Up</button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={toggleMenu}
              className={`md:hidden p-2.5 rounded-xl border border-[#8cc63f]/20 bg-white/50 backdrop-blur-sm transition-all duration-300 ${isMenuOpen ? 'bg-[#8cc63f]/10 border-[#8cc63f] rotate-180' : 'hover:bg-white'}`}
              aria-label="Toggle menu"
            >
              <div className={`hamburger-box ${isMenuOpen ? 'hamburger-open' : ''}`}>
                <span className="hamburger-inner"></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-x-0 top-[70px] bg-white/95 backdrop-blur-2xl border-b border-[#8cc63f]/20 transition-all duration-500 ease-in-out z-40 md:hidden overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 py-8 space-y-6">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link, idx) => (
              <Link 
                key={link.name}
                to={link.path} 
                onClick={closeMenu}
                className="text-[17px] font-extrabold text-gray-800 hover:text-[#8cc63f] transition-all flex items-center justify-between group"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                {link.name}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-[#8cc63f] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
            {tokenExpired ? (
              <button
                onClick={handleSilentReAuth}
                className="w-full py-4 text-[14px] font-black bg-[#8cc63f] text-white rounded-2xl shadow-lg uppercase tracking-wider"
              >
                Session Expired - Sign In
              </button>
            ) : user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8cc63f] to-[#7ab033] text-white flex items-center justify-center font-black text-lg shadow-md">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-bold text-[#8cc63f] uppercase tracking-widest leading-none mb-1">Authenticated</span>
                    <span className="font-extrabold text-gray-900 text-base">{displayName}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 text-[14px] font-black bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { navigate('/signin'); closeMenu(); }}
                  className="w-full py-4 text-[14px] font-bold text-gray-600 bg-gray-50 rounded-2xl transition-all"
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
    </header>
  );
}
