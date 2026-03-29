import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuthContext();

  useEffect(() => {
    axios.get("/me", { withCredentials: true })
      .then(res => {
        const user = res.data.user;
        
        // Update context just in case it's useful elsewhere
        if (login) login(user);

        // Check if the user is allowed to access this route
        if (allowedRoles && !allowedRoles.includes(user.role)) {
          // If not allowed, redirect them to their respective dashboard
          if (user.role === "Admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        navigate("/signin");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, allowedRoles, login]);

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
