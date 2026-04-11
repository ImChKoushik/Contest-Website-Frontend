import { createContext, useState, useContext, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && (parsedUser.role || parsedUser.email || parsedUser._id)) {
          return parsedUser;
        }
      } catch (error) {
        localStorage.removeItem('authUser');
      }
    }
    return null;
  });

  const [tokenExpired, setTokenExpired] = useState(false);

  // listen for global session expiry signals (e.g. from axiosInstance)
  useEffect(() => {
    const handleAuthExpired = () => setTokenExpired(true);
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const login = useCallback((userData, authToken, refreshToken) => {
    if (!userData || typeof userData !== 'object') return;
    if (userData.role || userData.email || userData._id) {
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      if (authToken) {
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
      } else if (authToken === null) {
        // Explicitly clear token if null is passed
        setToken(null);
        localStorage.removeItem('authToken');
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      } else if (refreshToken === null) {
        localStorage.removeItem('refreshToken');
      }
      
      setTokenExpired(false);
    }
  }, []);

  const updateUser = useCallback((userData) => {
    if (userData && (userData.role || userData.email || userData._id)) {
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      setTokenExpired(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setTokenExpired(false);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const markTokenExpired = useCallback(() => {
    setTokenExpired(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, tokenExpired, markTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
};
