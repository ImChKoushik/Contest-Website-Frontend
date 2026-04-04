import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, updateUser, logout, markTokenExpired } = useAuthContext();
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
        const res = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/user/me", { withCredentials: true });
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
            await axios.post("https://contest-backend-td3m.onrender.com/api/v1/user/generate-access", {}, { withCredentials: true });
            const retryRes = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/user/me", { withCredentials: true });
            const userData = retryRes.data?.user || retryRes.data?.data?.user;

            if (userData) {
              if (updateUser) updateUser(userData);
              handleRoleAccess(userData);
            } else {
              throw new Error("Refresh succeeded but user not found");
            }
          } catch (refreshErr) {
            if (!isMounted) return;
            // Refresh token also expired — mark token as expired so Navbar shows Sign In
            if (markTokenExpired) markTokenExpired();
            if (logout) logout();
            navigate("/signin", { replace: true });
          }
        } else {
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
