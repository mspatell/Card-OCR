import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userSub = localStorage.getItem('user_sub');
    const userName = localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('user_email');
    
    if (userSub) {
      setIsAuthenticated(true);
      setUser({
        sub: userSub,
        name: userName || 'User',
        email: userEmail || ''
      });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user_sub');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    setUser(null);
    window.location = "/login";
  };

  return { isAuthenticated, logout, user };
};
