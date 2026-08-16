// AquaEquity Authentication Context (JavaScript)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { DEMO_USERS } from '../mocks/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) {
      setUser(current);
    }
  }, []);

  const login = async (phone, otp, role = 'CITIZEN') => {
    setLoading(true);
    try {
      const res = await authService.verifyOtp(phone, otp, role);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const switchDemoRole = (roleKey) => {
    const selectedUser = DEMO_USERS[roleKey] || DEMO_USERS.citizen;
    localStorage.setItem('aquaequity_user', JSON.stringify(selectedUser));
    localStorage.setItem('aquaequity_token', selectedUser.token);
    setUser(selectedUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'CITIZEN',
        isAuthenticated: Boolean(user),
        login,
        logout,
        switchDemoRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
