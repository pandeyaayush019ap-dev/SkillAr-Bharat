# SkillAR Bharat - Setup Instructions

## 1. Firebase Configuration

This application requires a Firebase project.

1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Enable **Authentication** (Email/Password provider).
4.  Enable **Firestore Database** (Start in Test Mode for development).
5.  Enable **Storage** (Start in Test Mode for development).
6.  Go to Project Settings > General > Your apps > Web app.
7.  Register the app and copy the configuration.

## 2. Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`) and fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 3. Firestore Indexes (Optional but Recommended)

If you see index warnings in the console when querying sessions, follow the link provided in the console error to create the composite index for:
- Collection: `training_sessions`
- Fields: `userId` (Ascending), `timestamp` (Descending)

## 4. Run the Application

```bash
npm install
npm run dev
```

## 5. Admin Access

To access the Admin Panel:
1.  Sign up a new user.
2.  Go to Firestore Console > `users` collection.
3.  Find your user document.
4.  Change the `role` field from `'user'` to `'admin'`.
5.  Refresh the application. You will now see the "Admin" link in the navbar.
