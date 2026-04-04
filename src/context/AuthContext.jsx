import { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Only set the user if it looks like a valid user object
        if (parsedUser && (parsedUser.role || parsedUser.email || parsedUser._id)) {
          return parsedUser;
        }
      } catch (error) {
        console.error("Failed to parse user from local storage", error);
        localStorage.removeItem('authUser');
      }
    }
    return null;
  });

  const login = useCallback((userData) => {
    if (!userData || typeof userData !== 'object') return;
    
    // Ensure we are saving a valid user object, not an error response
    if (userData.role || userData.email || userData._id) {
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authUser');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
