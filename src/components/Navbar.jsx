import { useNavigate, Link } from 'react-router-dom';
import Button from './Button';
import { useAuthContext } from '../context/AuthContext';
import { useLogout } from '../hooks/useLogout';
import logo from '../assets/images/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { logout, loading } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const displayName = user?.userName || user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="bg-white sticky top-0 z-50 py-2 shadow-sm border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="Desun Academy" className="h-11 w-auto object-contain" />
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-10">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-semibold text-sm">Home</Link>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-semibold text-sm">Contests</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-semibold text-sm">About Us</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-semibold text-sm">Contact</a>
          </nav>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 bg-gray-50 py-1.5 pr-4 pl-1.5 rounded-full border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-[#8cc63f] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-gray-700 text-[14px] hidden sm:block tracking-tight">Hi, {displayName}!</span>
                </div>
                <button 
                  onClick={handleLogout}
                  disabled={loading}
                  className="text-[13px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <>
                <Button variant="secondary" className="px-5 font-bold text-sm" onClick={() => navigate('/signin')}>Sign In</Button>
                <Button variant="primary" className="px-6 py-2 text-sm" onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
