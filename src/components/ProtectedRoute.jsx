import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, login, updateUser, logout, markTokenExpired } = useAuthContext();
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [loading, setLoading] = useState(!!user); // verify in background only if user exists
  const navigate = useNavigate();

  useEffect(() => {
    // If no local user at all, redirect immediately
    if (!user) {
      navigate("/signin", { replace: true });
      return;
    }

    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get('/user/me');
        if (!isMounted) return;

        const userData = res.data?.user || res.data?.data?.user;
        const isSuccess = res.data?.success || (userData && userData.role);

        if (isSuccess && userData) {
          if (updateUser) updateUser(userData);
          handleRoleAccess(userData);
        } else {
          throw new Error("Invalid session data");
        }
      } catch (err) {
        if (!isMounted) return;

        const status = err.response?.status;

        if (status === 401 || status === 403) {
          // Access token expired — try to refresh silently
          try {
            let refreshRes;
            try {
              // Backend defines this as GET, not POST; axiosInstance sends Bearer + x-refresh-token header
              refreshRes = await axiosInstance.get('/user/generate-access');
            } catch (err) {
              if (err.response?.status === 404) {
                refreshRes = await axiosInstance.get('/user/refresh-token');
              } else {
                throw err;
              }
            }
            
            // Extract new token from refresh response
            const newToken = refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken || refreshRes.data?.token || refreshRes.data?.data?.token || null;
            
            const retryRes = await axiosInstance.get('/user/me');
            const userData = retryRes.data?.user || retryRes.data?.data?.user;

            if (userData) {
              // Sync user and the new token (if any) to localStorage.
              // If newToken is null, login will clear the stale authToken from localStorage.
              if (login) login(userData, newToken);
              handleRoleAccess(userData);
            } else {
              throw new Error("Refresh succeeded but user not found");
            }
          } catch (refreshErr) {
            if (!isMounted) return;
            // Refresh token also expired or invalid — mark token as expired and logout
            if (markTokenExpired) markTokenExpired();
            if (logout) logout();
            navigate("/signin", { replace: true });
          }
        }
 else {
          // Network/server error — stay optimistic, trust local user
          console.warn("Backend unreachable, trusting local session.");
          handleRoleAccess(user);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const handleRoleAccess = (userData) => {
      if (allowedRoles && userData.role && !allowedRoles.includes(userData.role)) {
        if (userData.role === "Admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, [navigate, allowedRoles, updateUser, logout, markTokenExpired]);

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
