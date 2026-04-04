import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from './Button';
import { useAuthContext } from '../context/AuthContext';
import { useLogout } from '../hooks/useLogout';
import axios from 'axios';
import logo from '../assets/images/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, tokenExpired, login } = useAuthContext();
  const { logout, loading } = useLogout();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // Silently refresh access token and re-login
  const handleSilentReAuth = async () => {
    setRefreshing(true);
    try {
      await axios.post("https://contest-backend-td3m.onrender.com/api/v1/user/generate-access", {}, { withCredentials: true });
      const res = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/user/me", { withCredentials: true });
      const userData = res.data?.user || res.data?.data?.user;
      if (userData) {
        login(userData);
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
    }
  };

  const displayName = user?.userName || user?.name || user?.email?.split('@')[0] || 'User';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contests', path: '#' },
    { name: 'About Us', path: '#' },
    { name: 'Contact', path: '#' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 py-1.5 border-b border-[#8cc63f]/10 shadow-[0_2px_15px_-3px_rgba(140,198,63,0.07)] overflow-hidden">
      {/* Animated Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-[#8cc63f]/5 to-white animate-navbar-gradient -z-10"></div>
      
      {/* Shimmering Bottom Border */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-[#8cc63f]/30 to-transparent animate-border-shimmer"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <img src={logo} alt="Desun Academy" className="h-10 md:h-11 w-auto object-contain" />
          </Link>
          
          {/* Navigation Links */}
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
          
          {/* Auth/Profile Section */}
          <div className="flex items-center space-x-4">
            {tokenExpired ? (
              // Access token expired — show re-auth button
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                  Session expired
                </span>
                <button
                  onClick={handleSilentReAuth}
                  disabled={refreshing}
                  className="px-6 py-2.5 text-[13px] font-black bg-[#8cc63f] hover:bg-[#7ab033] text-white rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(140,198,63,0.3)] hover:shadow-lg hover:-translate-y-0.5 uppercase tracking-wider disabled:opacity-70"
                >
                  {refreshing ? 'Reconnecting...' : 'Sign In'}
                </button>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* Profile Chip */}
                <div className="flex items-center gap-2.5 bg-gray-50/80 hover:bg-white pl-1.5 pr-4 py-1.5 rounded-full border border-gray-100 shadow-sm transition-all cursor-default group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8cc63f] to-[#7ab033] text-white flex items-center justify-center font-black text-[13px] shadow-sm transform group-hover:rotate-12 transition-transform">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#8cc63f] uppercase tracking-widest leading-none mb-0.5">Welcome</span>
                    <span className="font-extrabold text-gray-800 text-[13px] leading-none tracking-tight">
                      {displayName}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  disabled={loading}
                  className="group relative flex items-center justify-center w-10 h-10 md:w-auto md:px-5 md:h-10 rounded-full bg-white border-2 border-red-500/10 hover:border-red-500 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 shadow-sm overflow-hidden"
                  title="Logout"
                >
                  <span className="hidden md:inline text-[13px] font-black uppercase tracking-wider relative z-10">
                    {loading ? '...' : 'Logout'}
                  </span>
                  <span className="md:hidden relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/signin')}
                  className="px-5 py-2.5 text-[13px] font-bold text-gray-600 hover:text-[#8cc63f] transition-colors tracking-wide"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/signup')} 
                  className="px-6 py-2.5 text-[13px] font-black bg-[#8cc63f] hover:bg-[#7ab033] text-white rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(140,198,63,0.3)] hover:shadow-lg hover:-translate-y-0.5 uppercase tracking-wider"
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
