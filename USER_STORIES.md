# User Stories — LearnApp

## User Story 1: User Registration
**As** a new user,  
**I want** to register in the app with my username, email and password,  
**so that** I can create an account and access the learning courses.

**Acceptance criteria:**
- The registration form has three fields: username, email and password.
- An error is shown if any field is empty or the email is not valid.
- After registering successfully, the user is redirected to the home screen.

---

## User Story 2: User Login
**As** a registered user,  
**I want** to log in with my email and password,  
**so that** I can access my account and continue learning.

**Acceptance criteria:**
- The login form has two fields: email and password.
- An error message is shown if the credentials are wrong.
- After logging in successfully, the user is redirected to the home screen.

---

## User Story 3: Home Screen with Course Catalog
**As** an authenticated user,  
**I want** to see a home screen with a catalog of available courses,  
**so that** I can explore and choose what I want to learn.

**Acceptance criteria:**
- The home screen shows the app logo in the header.
- A list of courses/books fetched from an external API is displayed.
- Each item shows the title, author and a cover image.

---

## User Story 4: Course Detail Screen
**As** an authenticated user,  
**I want** to select a course from the home screen and see its details,  
**so that** I can get full information about the content before adding it to my favorites.

**Acceptance criteria:**
- Tapping an item in the list navigates to the detail screen.
- The detail screen shows the title, author, description and publication year.
- A navigation icon or button is visible on the main screen.

---

## User Story 5: Favorites with Persistent Storage
**As** an authenticated user,  
**I want** to save courses to my favorites list,  
**so that** I can access them easily at any time, even after closing the app.

**Acceptance criteria:**
- The user can add or remove courses from favorites on the detail screen.
- Favorites are stored locally using AsyncStorage.
- The favorites screen shows saved courses and persists between sessions.

---

## User Story 6: External API Integration
**As** a user,  
**I want** the app content to come from a real data source,  
**so that** I have access to up-to-date and relevant information.

**Acceptance criteria:**
- The home screen fetches data from the Open Library API.
- Data is displayed correctly with title, author and year.
- A loading indicator is shown while fetching the data.

---

## User Story 7: Settings Menu
**As** an authenticated user,  
**I want** to access a settings menu with available options,  
**so that** I can customize my experience inside the app.

**Acceptance criteria:**
- A settings icon is visible in the app.
- The menu shows options: Settings, Notifications and Logout.
- Each option navigates to its corresponding screen or triggers the action.

---

## User Story 8: Settings Screen
**As** an authenticated user,  
**I want** to adjust my profile settings and preferences,  
**so that** I can personalize the app to my needs.

**Acceptance criteria:**
- The settings screen has an option to change the username.
- The user can toggle dark mode on or off.
- Changes are saved locally and persist between sessions.

---

## User Story 9: Notifications
**As** an authenticated user,  
**I want** to receive notifications from the app,  
**so that** I stay informed about new courses and study reminders.

**Acceptance criteria:**
- The user can enable or disable notifications from the notifications screen.
- The system can send a test notification when they are enabled.
- The current notification status (on/off) is shown on screen.
