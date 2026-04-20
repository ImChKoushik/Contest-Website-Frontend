import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, updateUser, tokenExpired } = useAuthContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const handleRoleAccess = (userData) => {
      if (allowedRoles && userData.role && !allowedRoles.includes(userData.role)) {
        if (userData.role === 'Admin') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setIsAuthenticated(true);
      }
    };

    const checkAuth = async () => {
      // If we already know the token is expired/missing, don't try to
      // automatically validate via server (which might succeed due to cookies).
      // This ensures the "Login Again" button remains visible.
      if (tokenExpired && user) {
        handleRoleAccess(user);
        setLoading(false);
        return;
      }
      try {
        // Try /user/me with current access token
        const res = await axiosInstance.get('/user/me');
        if (!isMounted) return;

        const userData = res.data?.user || res.data?.data?.user;
        if (userData) {
          if (updateUser) updateUser(userData);
          handleRoleAccess(userData);
        } else {
          throw new Error('Invalid session data');
        }
      } catch (err) {
        if (!isMounted) return;

        const status = err.response?.status;
        const localUser = localStorage.getItem('authUser');

        if (status === 401 || status === 403 || status === 500 || err.isAuthBlock) {
          // Access token invalid — we trust the local user object if it exists
          // to keep the dashboard visible while the "Renew Session" button shows.
          if (user || localUser) {
            handleRoleAccess(user || JSON.parse(localUser));
            window.dispatchEvent(new CustomEvent('auth:expired'));
          } else {
            navigate('/signin', { replace: true });
          }
        } else if (!user && !localUser) {
          navigate('/signin', { replace: true });
        } else {
          // Network error but we have a user - stay put
          handleRoleAccess(user || JSON.parse(localUser));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, [navigate, allowedRoles, user, tokenExpired, updateUser]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#8cc63f]"></div>
          <p className="text-gray-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
}

