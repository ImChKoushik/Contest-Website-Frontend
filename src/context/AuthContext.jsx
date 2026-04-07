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

  const login = useCallback((userData, authToken) => {
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
