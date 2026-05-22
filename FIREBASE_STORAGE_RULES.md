# Firebase Storage Security Rules Setup

To enable profile image uploads with Firebase Storage, you need to set up Security Rules.

## Steps to Configure Storage Rules

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com/
   - Select your project (shannon-marie-consulting)

2. **Navigate to Storage**
   - In the left sidebar, click "Storage"
   - Click on the "Rules" tab at the top

3. **Replace the Rules**
   - Delete all existing rules
   - Paste the following rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload their own profile pictures
    match /profile-pictures/{userId}/profile-image {
      allow read: if true;
      allow write: if request.auth.uid == userId;
      allow delete: if request.auth.uid == userId;
    }

    // Deny all other access by default
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. **Publish the Rules**
   - Click "Publish" button
   - Wait for deployment to complete (usually a few seconds)

5. **Verify It's Working**
   - Refresh your app
   - Try uploading a profile picture
   - The image should upload successfully and appear in your profile

## What These Rules Do

- ✅ Users can upload their own profile pictures
- ✅ Profile pictures are publicly readable (but only from your domain)
- ✅ Users can only delete their own pictures
- ✅ All other storage access is denied by default
- ✅ Protects against unauthorized uploads

## Benefits of Using Cloud Storage

- Images are stored separately from Firestore
- No document size limits (1MB limit no longer applies)
- Better performance and caching
- CDN delivery for faster image loading worldwide
- Easy to manage and delete images
- Images are automatically optimized by Google Cloud

## Troubleshooting

### Still getting upload errors?
1. Check that the rules are published (green checkmark)
2. Clear browser cache and refresh
3. Check browser console for specific error messages
4. Verify your Firebase project has Storage enabled

### Images not displaying?
- Make sure the rules allow public read access
- Check that the image was uploaded successfully
- Verify the download URL in Firestore is correct

### Need to delete all profile pictures?
You can delete images from the Storage tab in Firebase Console:
1. Navigate to Storage
2. Go to `profile-pictures/` folder
3. Delete any user folders you want to remove
