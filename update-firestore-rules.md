# How to Update Firestore Security Rules

## Method 1: Firebase Console (Recommended)

1. **Open Firebase Console**: https://console.firebase.google.com/project/edu-mate12/firestore/rules
2. **Replace existing rules** with one of the options below
3. **Click "Publish"** to apply the rules

## Method 2: Firebase CLI

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Deploy rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Rules Options

### Option 1: Development Rules (Allow All Access)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Option 2: Production Rules (Authenticated Users Only)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Allow read/write for specializations collection (authenticated users)
    match /specializations/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Allow read/write for academic_imports collection (authenticated users)
    match /academic_imports/{docId} {
      allow read, write: if request.auth != null;
    }

    // Allow read/write for academic_records collection (authenticated users)
    match /academic_records/{docId} {
      allow read, write: if request.auth != null;
    }

    // Allow read/write for users collection (authenticated users)
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## After Updating Rules

1. **Test the application**:
   - Open: http://localhost:3001/dashboard/academic-data
   - Check Console for successful fetch
   - Verify specializations load
   - Test Import Records functionality

2. **Expected Results**:
   - `specializationsData.length > 0`
   - `cyber-security` document appears
   - Specialization dropdown works
   - Import Records creates documents in Firestore

## Important Notes

- **Development Rules** (Option 1) are less secure but easier for testing
- **Production Rules** (Option 2) require user authentication
- Make sure you're **logged in** to the application before testing
- Rules may take a few seconds to propagate after publishing
