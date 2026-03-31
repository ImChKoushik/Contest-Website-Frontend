import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { login, logout } = useAuthContext();

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        // Step 1: Try to get current user data
        const res = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/user/me", { withCredentials: true });
        
        if (!isMounted) return;

        const userData = res.data?.user || res.data?.data?.user;
        const isSuccess = res.data?.success || (userData && userData.role);

        if (isSuccess && userData) {
          if (login) login(userData);
          handleRoleAccess(userData);
        } else {
          throw new Error("Invalid session");
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn("Initial session check failed, attempting token refresh...");

        try {
          // Step 2: Session expired but browser still open? Try to generate new access token
          // Using POST for generate-access as is standard for token refresh flows
          await axios.post("https://contest-backend-td3m.onrender.com/api/v1/user/generate-access", {}, { withCredentials: true });
          
          // Step 3: Refresh succeeded! Retry getting user data
          const retryRes = await axios.get("https://contest-backend-td3m.onrender.com/api/v1/user/me", { withCredentials: true });
          
          const userData = retryRes.data?.user || retryRes.data?.data?.user;
          if (userData) {
            if (login) login(userData);
            handleRoleAccess(userData);
          } else {
            throw new Error("Refresh succeeded but user not found");
          }
        } catch (refreshErr) {
          if (!isMounted) return;
          console.error("Silent authentication failed:", refreshErr);
          
          // Step 4: Everything failed, clear state and redirect
          if (logout) logout();
          navigate("/signin", { replace: true });
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
