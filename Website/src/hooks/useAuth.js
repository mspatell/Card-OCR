import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userSub = localStorage.getItem('user_sub');
    setIsAuthenticated(!!userSub);
  }, []);

  const logout = () => {
    localStorage.removeItem('user_sub');
    setIsAuthenticated(false);
    window.location = "/login";
  };

  return { isAuthenticated, logout };
};
