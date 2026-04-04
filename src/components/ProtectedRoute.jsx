import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, login, logout } = useAuthContext();
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [loading, setLoading] = useState(!user);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        // Background verification
        const res = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/user/me", { withCredentials: true });
        
        if (!isMounted) return;

        const userData = res.data?.user || res.data?.data?.user;
        const isSuccess = res.data?.success || (userData && userData.role);

        if (isSuccess && userData) {
          if (login) login(userData);
          handleRoleAccess(userData);
        } else {
          throw new Error("Invalid session data");
        }
      } catch (err) {
        if (!isMounted) return;

        const status = err.response?.status;
        const isAuthError = [401, 403].includes(status);

        // Only attempt refresh / logout on explicit auth errors
        if (isAuthError) {
          console.warn("Session invalid, attempting token refresh...");
          try {
            await axios.post("https://contest-backend-td3m.onrender.com/api/v1/user/generate-access", {}, { withCredentials: true });
            
            const retryRes = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/user/me", { withCredentials: true });
            const userData = retryRes.data?.user || retryRes.data?.data?.user;
            
            if (userData) {
              if (login) login(userData);
              handleRoleAccess(userData);
            } else {
              throw new Error("Refresh failed");
            }
          } catch (refreshErr) {
            if (!isMounted) return;
            console.error("Authentication failed:", refreshErr);
            if (logout) logout();
            navigate("/signin", { replace: true });
          }
        } else {
          // Network error or other non-auth error. 
          // If we already have a user, stay optimistic. Otherwise, redirect to signin.
          console.warn("Backend unreachable or non-auth error. Current access status:", !!user);
          if (!user) {
            navigate("/signin", { replace: true });
          } else {
            handleRoleAccess(user);
          }
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
  }, [navigate, allowedRoles, login, logout]);

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
