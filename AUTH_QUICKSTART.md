# Auth Setup - Quick Start 🚀

Your authentication system is **ready to use**! Here's how to access the modals:

## ✅ What's Already Done

1. ✅ Firebase SDK installed
2. ✅ Auth components created (`SignUpModal.tsx`, `LoginModal.tsx`)
3. ✅ Auth context created (`AuthContext.tsx`)
4. ✅ API client with auto auth headers (`apiClient.ts`)
5. ✅ Navbar updated with auth buttons
6. ✅ AuthProvider added to your layout

## 🎯 How to Access the Modals

The auth modals are now in your **Navbar**! Look at the top-right corner:

### When NOT logged in:
- **"Sign In"** button (left) - Opens login modal
- **"Sign Up"** button (right, highlighted) - Opens signup modal

### When logged in:
- **User Icon** - Click to see dropdown with:
  - Your name and email
  - Profile link
  - Settings link
  - **Logout** button

## 🔥 Final Setup Steps (3 minutes)

### 1. Get Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create new)
3. **⚙️ Project Settings** → **Your apps** section
4. If no web app: Click **</>** to add one
5. Copy the config values

### 2. Create `.env.local`

```bash
cd voyagr-web
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000

# Paste your Firebase config here:
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Enable Auth in Firebase Console

1. **Build** → **Authentication** → **Get Started**
2. **Sign-in method** tab
3. Enable:
   - ✅ **Email/Password**
   - ✅ **Google** (optional)

## 🚦 Testing

### Start your app:
```bash
npm run dev
```

### Test the flow:
1. Open `http://localhost:3000`
2. Look at the top-right corner of the navbar
3. Click **"Sign Up"** button
4. Fill out the form and create account
5. Check Firebase Console → Authentication to see your user!

## 📍 Where to Find the Buttons

```
Navbar (Top Right Corner)
├─ Search Icon
├─ Notifications Bell (with badge)
└─ Auth Section:
    ├─ [NOT LOGGED IN]:
    │   ├─ "Sign In" button (text button)
    │   └─ "Sign Up" button (highlighted primary button)
    │
    └─ [LOGGED IN]:
        └─ User Icon → Dropdown:
            ├─ Name & Email
            ├─ Profile
            ├─ Settings
            └─ Logout
```

## 💡 Visual Guide

### Before Login:
```
[Search] [🔔] [Sign In] [Sign Up]
                ↑        ↑
            Opens      Opens
            Login      SignUp
            Modal      Modal
```

### After Login:
```
[Search] [🔔] [👤]
                ↑
              User
              Menu
```

## 🎨 Modal Features

### SignUpModal:
- Email/password fields
- Display name
- Password confirmation
- Google sign-in button
- Switch to login link

### LoginModal:
- Email/password fields
- Forgot password link
- Google sign-in button
- Switch to sign up link

## 🛠️ Troubleshooting

**Can't see the buttons?**
- Make sure you're looking at the **top-right** of the navbar
- Scroll to top of page (navbar might be hidden on scroll)
- Check browser console for errors

**Buttons not working?**
- Make sure `.env.local` exists with Firebase config
- Restart dev server: `npm run dev`
- Check Firebase Console → Authentication is enabled

**"Configuration object is invalid"?**
- Double-check all Firebase env variables are set in `.env.local`
- Make sure no quotes around the values in `.env.local`

**TypeScript errors?**
- Restart your TypeScript server in VS Code
- Or run: `npm run dev` again

## 📚 Next Steps

Once logged in, you can:
- ✅ Access protected routes
- ✅ Make authenticated API calls
- ✅ See your user info in the dropdown
- ✅ Test logout functionality

## 🔗 Full Documentation

For more details, see:
- **FIREBASE_SETUP.md** - Complete setup guide
- **Backend API** - `voyagr-api/README.md`

---

**You're all set! Just click the buttons in the navbar!** 🎉

Look at the **top-right corner** → Click **"Sign Up"** to start!