# Uprent Plus Mobile App

React Native mobile application built with Expo and Expo Router.

## Setup

### Prerequisites
- Node.js 20+
- pnpm 9+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Emulator

### Installation

```bash
# Install dependencies from monorepo root
pnpm install

# Start development server
cd apps/mobile
pnpm start
```

### Environment Variables

Create `.env.local` file in `apps/mobile/`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_API_URL=https://your-app.vercel.app
```

### Running the App

```bash
# Start Expo dev server
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Run on web
pnpm web
```

## Project Structure

```
apps/mobile/
├── app/                    # Expo Router file-based routing
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Entry point (redirects based on auth)
│   ├── (auth)/            # Authentication routes
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/            # Main app tabs
│       ├── _layout.tsx
│       ├── index.tsx      # Home/Dashboard
│       ├── search.tsx     # Property search
│       ├── matches.tsx    # Property matches
│       ├── saved.tsx      # Saved properties
│       └── profile.tsx    # User profile
├── components/            # Reusable React Native components
├── hooks/                 # Custom React hooks
│   └── use-auth.ts        # Authentication hook
├── lib/                   # Utilities and configurations
│   ├── api.ts            # API client setup
│   └── supabase.ts       # Supabase client
├── constants/             # App constants
│   └── config.ts         # Configuration constants
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler configuration
└── tsconfig.json         # TypeScript configuration
```

## Features

- **Expo Router** - File-based routing
- **Supabase Auth** - Authentication with secure token storage
- **API Client** - Shared API client from `@uprent-plus/api-client`
- **TypeScript** - Full type safety
- **Dark Theme** - Consistent with web app design

## Building for Production

### EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS (first time)
eas login
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

### Build Profiles

- **development** - Development builds with dev client
- **preview** - Internal distribution (TestFlight/Internal Testing)
- **production** - App Store/Play Store builds

## Bundle IDs

- **iOS**: `com.uprentplus.mobile`
- **Android**: `com.uprentplus.mobile`

## Dependencies

- `expo` - Expo SDK
- `expo-router` - File-based routing
- `expo-secure-store` - Secure token storage
- `@supabase/supabase-js` - Supabase client
- `@uprent-plus/api-client` - Shared API client
- `@uprent-plus/database` - Database types and utilities

## Development

The mobile app uses shared packages from the monorepo:
- `@uprent-plus/api-client` - API client for Next.js routes
- `@uprent-plus/database` - Database types and Supabase utilities

See monorepo root README for more information.

