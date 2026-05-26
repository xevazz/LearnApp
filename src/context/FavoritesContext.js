import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from '../services/storageService';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // load saved favorites from AsyncStorage on mount
  useEffect(() => {
    const load = async () => {
      const stored = await getFavorites();
      setFavorites(stored);
    };
    load();
  }, []);

  const toggleFavorite = async (course) => {
    const already = await isFavorite(course.key);
    if (already) {
      const updated = await removeFavorite(course.key);
      setFavorites(updated);
    } else {
      const updated = await addFavorite(course);
      setFavorites(updated);
    }
  };

  // helper so components don't need to call the service directly
  const checkIsFavorite = (courseKey) =>
    favorites.some((f) => f.key === courseKey);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, checkIsFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
};
