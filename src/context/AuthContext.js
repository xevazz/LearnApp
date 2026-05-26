import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredUser,
  loginUser,
  registerUser,
  logoutUser,
} from '../services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if there's already a logged-in user when the app starts
  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await getStoredUser();
        if (stored) setUser(stored);
      } catch (e) {
        console.log('Error restoring session:', e);
      }
      setLoading(false);
    };
    restore();
  }, []);

  const register = async (username, email, password) => {
    const newUser = await registerUser(username, email, password);
    setUser(newUser);
    return newUser;
  };

  const login = async (email, password) => {
    const loggedUser = await loginUser(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
