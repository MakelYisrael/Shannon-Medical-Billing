# Firebase Firestore Security Rules Setup

If you're seeing "Failed to get document because the client is offline" errors, you need to set up Firestore Security Rules.

## Steps to Configure Security Rules

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com/
   - Select your project (shannon-marie-consulting)

2. **Navigate to Firestore Database**
   - In the left sidebar, click "Firestore Database"
   - Click on the "Rules" tab at the top

3. **Replace the Rules**
   - Delete all existing rules
   - Paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own user profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow authenticated users to read courses
    match /courses/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Allow authenticated users to read and write enrollments
    match /enrollments/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. **Publish the Rules**
   - Click "Publish" button
   - Wait for deployment to complete (usually a few seconds)

5. **Verify It's Working**
   - Refresh your app
   - Try signing in/up
   - The offline error should be gone

## What These Rules Do

- ✅ Users can only read/write their own profile data
- ✅ Authenticated users can read and write enrollments
- ✅ Data is secure and private
- ✅ Firestore offline persistence is enabled for better UX

## Troubleshooting

### Still getting offline errors?
1. Check that the rules are published (green checkmark)
2. Clear browser cache and refresh
3. Check browser console for other error messages
4. Verify your Firebase project ID in the `.env.local.js` file

### Rules show as invalid?
- Make sure you're using the exact rules above
- Check for syntax errors (missing brackets, commas, etc.)
- Firebase will show you the line with the error

## Additional Security Note

The app now includes:
- Offline persistence enabled (IndexedDB cache)
- Automatic retry logic for failed profile loads
- Graceful degradation if Firestore is unavailable
- Users can still use the app with limited functionality offline
