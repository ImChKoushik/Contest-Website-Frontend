import { createContext, useState, useContext, useCallback } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Always use localStorage so the session survives browser close/reopen
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

  // tokenExpired flag: true when access token has expired but refresh token still valid
  const [tokenExpired, setTokenExpired] = useState(false);

  const login = useCallback((userData) => {
    if (!userData || typeof userData !== 'object') return;
    if (userData.role || userData.email || userData._id) {
      setUser(userData);
      setTokenExpired(false);
      localStorage.setItem('authUser', JSON.stringify(userData));
    }
  }, []);

  // updateUser: refreshes in-memory state only — does NOT touch storage.
  const updateUser = useCallback((userData) => {
    if (userData && (userData.role || userData.email || userData._id)) {
      setUser(userData);
      setTokenExpired(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTokenExpired(false);
    localStorage.removeItem('authUser');
  }, []);

  const markTokenExpired = useCallback(() => {
    setTokenExpired(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, tokenExpired, markTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
};
