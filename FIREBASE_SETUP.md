# Firebase Setup Guide

This guide will help you set up Firebase Authentication for the Shannon Marie application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter your project name (e.g., "shannon-marie-app")
4. Accept the terms and create the project
5. Wait for the project to be created

## Step 2: Create a Web App

1. In the Firebase Console, click the settings icon (⚙️) and select "Project Settings"
2. Click on the "Your apps" section
3. Click on the Web icon (</>) to register a new web app
4. Enter your app name (e.g., "Shannon Marie Web")
5. Check "Also set up Firebase Hosting for this app" (optional)
6. Click "Register app"

## Step 3: Copy Firebase Config

1. Firebase will display your config object. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "project-name.firebaseapp.com",
  projectId: "project-name",
  storageBucket: "project-name.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

2. Copy these values

## Step 4: Add Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase config values:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Step 5: Enable Authentication Methods

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started" or "Sign-in method"
3. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Make sure "Password Authentication" is enabled
   - Click "Save"
4. (Optional) Add other sign-in methods like Google, GitHub, etc.

## Step 6: Update Your Dev Server

After adding the environment variables, restart your dev server:

```bash
npm run dev
```

The dev server will automatically pick up the new environment variables.

## Step 7: Test the Authentication

1. Go to http://localhost:5173
2. Click "Sign Up" in the top navigation
3. Create a test account with your email
4. You should be redirected to the course portal
5. Click "Sign Out" to test the sign-out functionality
6. Click "Sign In" to test signing back in

## Features

The authentication system includes:

- **Sign Up**: Create new account with email and password
- **Sign In**: Login with existing credentials
- **Sign Out**: Logout from the application
- **Protected Routes**: Course portal (/portal) requires authentication
- **Auth State**: User email displayed in navigation when logged in
- **Error Handling**: Clear error messages for failed authentication attempts

## Security Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Keep your Firebase API keys confidential
- Firebase Authentication is handled on the client-side by the Firebase SDK
- Passwords are encrypted by Firebase before transmission
- Use Firebase Rules to protect your Firestore data (if using database)

## Troubleshooting

### "Authentication is not initialized" error
- Make sure your `.env.local` file has all required Firebase config values
- Restart the dev server after updating environment variables

### "Invalid API Key" error
- Verify your API key is correct in `.env.local`
- Make sure you're using `VITE_FIREBASE_` prefix for client-side variables

### Sign up fails silently
- Check browser console for error messages
- Verify Email/Password authentication is enabled in Firebase Console
- Check that your email isn't already registered

### Can't access portal after signing in
- Make sure `/portal` route is protected with `ProtectedRoute`
- Check that `CoursePortal` component exists
- Clear browser cookies/cache and try again

## Next Steps

1. Add email verification
2. Add password reset functionality
3. Add user profile pages
4. Add role-based access control (e.g., admin panel)
5. Connect Firestore for storing user data
6. Add additional authentication providers (Google, GitHub, etc.)
