# Firebase Authentication Setup Guide

## ✅ Components Created

The following files have been created in your frontend:

```
src/
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   └── apiClient.ts          # API client with auth
├── contexts/
│   └── AuthContext.tsx       # Auth context & hooks
└── components/
    └── Auth/
        ├── SignUpModal.tsx   # Sign up component
        └── LoginModal.tsx    # Login component
```

## 🔥 Firebase Console Setup

### Step 1: Get Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create new)
3. Click **⚙️ Project Settings**
4. Scroll to **Your apps** section
5. If no web app exists, click **</>** to add one
6. Copy the config object

### Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable these methods:
   - ✅ **Email/Password**
   - ✅ **Google** (optional but recommended)

### Step 3: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Firebase config:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000

   # Get these from Firebase Console
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. **Important:** Never commit `.env.local` to git!

## 🔌 Integration Steps

### Step 1: Add AuthProvider to Layout

Update `src/app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FavoritesProvider>
            <NavbarVisibilityProvider>
              <FooterVisibilityProvider>
                {children}
              </FooterVisibilityProvider>
            </NavbarVisibilityProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 2: Add Auth Buttons to Navbar

Update `src/components/Navbar.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/Auth/LoginModal';
import SignUpModal from '@/components/Auth/SignUpModal';
import { User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      <nav className="...">
        {/* Your existing navbar content */}

        {/* Add this auth section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignUp={() => {
          setShowLogin(false);
          setShowSignUp(true);
        }}
      />

      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToLogin={() => {
          setShowSignUp(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
```

### Step 3: Use Auth in Your App

#### Check if user is logged in:
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please sign in</div>;

  return <div>Hello {user.displayName}!</div>;
}
```

#### Make authenticated API calls:
```typescript
import { api } from '@/lib/apiClient';

async function createEvent() {
  try {
    const result = await api.post('/api/calendar/events', {
      title: 'My Event',
      type: 'event',
      date: '2025-12-25'
    }, true); // true = requires authentication

    console.log('Created:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 🧪 Testing

### Test Sign Up
1. Start your dev server: `npm run dev`
2. Click "Sign Up" button
3. Fill out the form
4. Check Firebase Console → Authentication to see the new user

### Test Sign In
1. Click "Sign In"
2. Enter your credentials
3. You should be logged in

### Test Protected Routes
```typescript
// Example: Protect a page
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

## 🔒 Security Best Practices

### Firestore Security Rules

Add these to Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    match /calendar_events/{eventId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }

    match /favorites/{favoriteId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow delete: if isOwner(resource.data.userId);
    }

    match /deals/{dealId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 📱 Features Included

### SignUpModal
- ✅ Email/password registration
- ✅ Google sign-in
- ✅ Display name field
- ✅ Password confirmation
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Switch to login

### LoginModal
- ✅ Email/password login
- ✅ Google sign-in
- ✅ Forgot password
- ✅ Password reset via email
- ✅ Error handling
- ✅ Loading states
- ✅ Switch to sign up

### AuthContext
- ✅ User state management
- ✅ Auto-persist sessions
- ✅ Sign up/in/out methods
- ✅ Password reset
- ✅ Get auth tokens
- ✅ Loading states

### API Client
- ✅ Auto-attach auth tokens
- ✅ Handle expired tokens
- ✅ Convenience methods (get, post, put, delete)
- ✅ Error handling

## 🚨 Troubleshooting

### "Firebase: Error (auth/...)"
Check Firebase Console → Authentication to see if the sign-in method is enabled.

### "Popup blocked"
Allow popups for localhost in your browser settings.

### "Configuration object is invalid"
Make sure all environment variables in `.env.local` are set correctly.

### "Cannot read properties of null"
Make sure `AuthProvider` wraps your app in `layout.tsx`.

### CORS errors
Make sure your backend `.env` has:
```env
WEB_ORIGIN=http://localhost:3000
```

## 🎯 Next Steps

1. ✅ Test sign up/login
2. ✅ Add auth buttons to your navbar
3. ✅ Protect routes that need authentication
4. ✅ Update API calls to use authenticated requests
5. 📧 Optional: Add email verification
6. 👤 Optional: Add user profile page
7. 🔐 Optional: Add 2FA

## 📚 Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**Your auth system is ready to use! 🎉**