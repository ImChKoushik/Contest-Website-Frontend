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

  const [tokenExpired, setTokenExpired] = useState(() => {
    // If we have a user but NO authToken in localStorage, assume session needs syncing
    return !!localStorage.getItem('authUser') && !localStorage.getItem('authToken');
  });

  // listen for global session expiry signals (e.g. from axiosInstance)
  useEffect(() => {
    const handleAuthExpired = () => {
      // Ignore the event if the user intentionally logged out.
      // The logout flow sets this flag to prevent the 401 from the
      // logout endpoint incorrectly showing the "Login Again" button.
      if (sessionStorage.getItem('intentionalLogout')) return;
      setTokenExpired(true);
    };
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const login = useCallback((userData, authToken, refreshToken) => {
    if (!userData || typeof userData !== 'object') return;
    if (userData.role || userData.email || userData._id) {
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      // Mark this as an active browser session (cleared on browser close)
      sessionStorage.setItem('sessionActive', 'true');
      
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
      // Only clear the "Login Again" state if we actually have a token now
      if (localStorage.getItem('authToken')) {
        setTokenExpired(false);
      }
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setTokenExpired(false);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('sessionActive');
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
