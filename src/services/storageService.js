import AsyncStorage from '@react-native-async-storage/async-storage';

// keys for all the data we store locally
const KEYS = {
  USER: '@learnapp_user',
  USERS_DB: '@learnapp_users_db',
  FAVORITES: '@learnapp_favorites',
  SETTINGS: '@learnapp_settings',
  NOTIFICATIONS: '@learnapp_notifications',
};

// ── Auth ─────────────────────────────────────────────────────────────────────

export const registerUser = async (username, email, password) => {
  const raw = await AsyncStorage.getItem(KEYS.USERS_DB);
  const users = raw ? JSON.parse(raw) : [];

  // check if email is already taken
  const exists = users.find((u) => u.email === email);
  if (exists) throw new Error('Email is already registered.');

  const newUser = { id: Date.now().toString(), username, email, password };
  users.push(newUser);
  await AsyncStorage.setItem(KEYS.USERS_DB, JSON.stringify(users));

  // store session without exposing password
  const { password: _, ...safeUser } = newUser;
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(safeUser));
  return safeUser;
};

export const loginUser = async (email, password) => {
  const raw = await AsyncStorage.getItem(KEYS.USERS_DB);
  const users = raw ? JSON.parse(raw) : [];

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Wrong email or password.');

  const { password: _, ...safeUser } = user;
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(safeUser));
  return safeUser;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(KEYS.USER);
};

export const getStoredUser = async () => {
  const raw = await AsyncStorage.getItem(KEYS.USER);
  return raw ? JSON.parse(raw) : null;
};

export const updateUsername = async (newUsername) => {
  const raw = await AsyncStorage.getItem(KEYS.USER);
  if (!raw) return;
  const user = JSON.parse(raw);
  user.username = newUsername;
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  return user;
};

// ── Favorites ─────────────────────────────────────────────────────────────────

export const getFavorites = async () => {
  const raw = await AsyncStorage.getItem(KEYS.FAVORITES);
  return raw ? JSON.parse(raw) : [];
};

export const addFavorite = async (course) => {
  const favorites = await getFavorites();
  // avoid duplicates
  const alreadyAdded = favorites.find((f) => f.key === course.key);
  if (alreadyAdded) return favorites;
  const updated = [...favorites, course];
  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
  return updated;
};

export const removeFavorite = async (courseKey) => {
  const favorites = await getFavorites();
  const updated = favorites.filter((f) => f.key !== courseKey);
  await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
  return updated;
};

export const isFavorite = async (courseKey) => {
  const favorites = await getFavorites();
  return favorites.some((f) => f.key === courseKey);
};

// ── Settings ──────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = { darkMode: false };

export const getSettings = async () => {
  const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
  return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
};

export const saveSettings = async (settings) => {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// ── Notifications ─────────────────────────────────────────────────────────────

export const getNotificationPrefs = async () => {
  const raw = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
  return raw ? JSON.parse(raw) : { enabled: false };
};

export const saveNotificationPrefs = async (prefs) => {
  await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(prefs));
};
