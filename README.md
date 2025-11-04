# Voyagr - AI Travel Platform

Modern travel planning application with AI-powered trip planner, interactive components, and real-time itinerary building.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your Firebase credentials to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✨ Features

- **AI Trip Planning Wizard** - 9-step conversational flow (destination → dates → budget → flights → hotels → activities)
- **Live Itinerary Panel** - Real-time updates as selections are made
- **Interactive Components** - Quick replies, calendars, carousels, grids, sliders
- **Firebase Authentication** - Email/password and Google sign-in
- **Glassmorphism UI** - Modern frosted glass design
- **Mobile Responsive** - Touch-optimized for iOS & Android

## 📋 Environment Setup

Create `.env.local`:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Firebase (from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Optional
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** → **Email/Password** and **Google**
3. Copy config values to `.env.local`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── ai/                 # AI chat page
│   └── api/                # API routes
├── components/
│   ├── AI/                 # AI components
│   │   ├── InteractiveMessages/  # Wizard UI components
│   │   ├── TripPlanningWizard.tsx
│   │   └── LiveItineraryPanel.tsx
│   └── Auth/               # Auth modals
├── contexts/               # React Context providers
│   ├── AuthContext.tsx
│   └── TripPlanningContext.tsx
├── hooks/                  # Custom hooks
├── lib/                    # API integrations
├── types/                  # TypeScript types
├── constants/              # App constants
└── utils/                  # Helper functions
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run type-check  # TypeScript validation
```

### Adding a Wizard Step

1. **Update types** (`src/types/tripPlanning.ts`):
```typescript
export type WizardStep = 'destination' | 'dates' | ... | 'newStep';
```

2. **Add to constants** (`src/constants/tripPlanning.ts`):
```typescript
export const WIZARD_STEPS = ['destination', 'dates', ..., 'newStep'];
export const WIZARD_STEP_CONFIG = {
  newStep: { title: 'Title', description: 'Description', icon: '🎯' }
};
```

3. **Implement in wizard** (`src/components/AI/TripPlanningWizard.tsx`):
```typescript
case 'newStep':
  return <YourComponent onSelect={handleSelect} />;
```

4. **Add validation** (`src/utils/tripPlanningHelpers.ts`):
```typescript
case 'newStep': return !!itinerary.field;
```

### Using Auth

```typescript
import { useAuth } from '@/contexts/AuthContext';

function Component() {
  const { user, loading, logout } = useAuth();
  if (!user) return <div>Sign in required</div>;
  return <div>Hello {user.displayName}</div>;
}
```

### Using Trip Planning Context

```typescript
import { useTripPlanningContext } from '@/contexts/TripPlanningContext';

function Component() {
  const { itinerary, updateItinerary, currentStep } = useTripPlanningContext();
  // Use state
}
```

## 🎨 Styling

### Glassmorphism Classes

```css
.glass-card     /* Card with blur effect */
.glass-panel    /* Panel background */
.glass-input    /* Input background */
.neon-glow      /* Animated focus */
```

### Gradient Presets

```typescript
import { GRADIENT_PRESETS } from '@/constants/tripPlanning';

<div className={GRADIENT_PRESETS.flights} />   // Sky blue
<div className={GRADIENT_PRESETS.hotels} />    // Orange
<div className={GRADIENT_PRESETS.restaurants} /> // Purple
```

### Responsive

```jsx
<div className="px-4 sm:px-6 lg:px-8" />  // Mobile → Tablet → Desktop
```

## 🔌 API Routes Required

Create these Next.js API routes:

- `POST /api/ai/trip-planning` - AI responses
- `POST /api/ai/suggest-destinations` - Destination suggestions
- `POST /api/ai/suggest-flights` - Flight options
- `POST /api/ai/suggest-hotels` - Hotel recommendations
- `POST /api/ai/suggest-activities` - Activity suggestions
- `POST /api/ai/generate-itinerary` - Day-by-day plans

## 🚢 Deployment

```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy
```

Set environment variables in hosting platform settings.

## 🐛 Common Issues

**Firebase errors**: Verify all env vars are set, restart dev server

**TypeScript errors**: Run `npm run type-check`

**Wizard not activating**: Check for keywords (plan, trip, travel) in message

**Build fails**: Clear cache with `rm -rf .next node_modules && npm install`

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

### Code Standards

- Use TypeScript for all files
- Follow ESLint configuration
- Add JSDoc for public functions
- Use `useCallback`/`useMemo` for optimization
- Wrap components with `ErrorBoundary`
- Keep components < 200 lines

## 📚 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Firebase** - Authentication
- **Gemini AI** - AI suggestions
- **React Context** - State management

## 📄 License

Proprietary and confidential.

---

**Need help?** Check the code comments or open an issue.
