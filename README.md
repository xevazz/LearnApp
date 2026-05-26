# LearnApp

Final project for the React Native course. A mobile learning app that lets users browse programming books, save favorites and manage their profile.

## What it does

- Register and log in with email and password (stored locally with AsyncStorage)
- Browse a list of programming books pulled from the Open Library API
- Tap any book to see more details
- Save books to favorites — they persist between sessions
- Settings screen to update your username and toggle dark mode
- Notifications screen to enable/disable push notifications

## Tech stack

- React Native + Expo
- React Navigation (stack + bottom tabs)
- AsyncStorage for local persistence
- Open Library API for book data
- expo-notifications for push notifications
- Context API for state management (auth + favorites)

## How to run it

```bash
npm install
npm start
```

Then scan the QR code with Expo Go on your phone, or press `a` for Android emulator.

## Project structure

```
src/
  screens/       all the app screens
  navigation/    stack and tab navigators
  context/       AuthContext and FavoritesContext
  services/      API calls and AsyncStorage logic
  components/    reusable components (Logo)
```

## User stories

See [USER_STORIES.md](./USER_STORIES.md) for the full list.
