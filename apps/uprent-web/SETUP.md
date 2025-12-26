# Mobile App Setup Guide

## Quick Start

### Step 1: Install Global CLI Tools

```bash
npm install -g expo-cli eas-cli
```

### Step 2: Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### Step 3: Configure Environment Variables

1. Copy the example file:
   ```bash
   cd apps/mobile
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in your values:
   - **EXPO_PUBLIC_API_URL**: Your Next.js backend URL (e.g., `https://uprent-plug-web.vercel.app`)
   - **EXPO_PUBLIC_SUPABASE_URL**: Get from Supabase Dashboard → Settings → API
   - **EXPO_PUBLIC_SUPABASE_ANON_KEY**: Get from Supabase Dashboard → Settings → API

### Step 4: Start the Development Server

```bash
cd apps/mobile
npx expo start
```

When the terminal shows options:
- Press **`i`** for iOS Simulator (requires Xcode)
- Press **`a`** for Android Emulator (requires Android Studio)
- Scan QR code with Expo Go app on your phone

### Step 5: Login to Expo (Optional but Recommended)

For cloud builds and EAS services:

```bash
expo login
```

Create an account at https://expo.dev if you don't have one.

## Troubleshooting

### Metro Bundler Errors

Clear cache and restart:

```bash
npx expo start --clear
```

### Port Conflicts

Use a different port:

```bash
npx expo start --port 8082
```

### Simulator Not Opening

**iOS:**
1. Open Xcode
2. Xcode → Open Developer Tool → Simulator
3. Manually start a simulator
4. Run `npx expo start` again

**Android:**
1. Open Android Studio
2. Tools → Device Manager
3. Start an emulator
4. Run `npx expo start --android`

### Dependencies Not Found

If you see module not found errors:

```bash
# From monorepo root
pnpm install

# Then rebuild
cd apps/mobile
npx expo start --clear
```

## Environment Variables

All environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

Required variables:
- `EXPO_PUBLIC_API_URL` - Backend API URL
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

Optional variables:
- `EXPO_PUBLIC_EAS_PROJECT_ID` - EAS project ID (set after `eas init`)

## Next Steps

After the app runs successfully:
1. Test authentication flow
2. Verify API connectivity
3. Test property features
4. Configure push notifications

See the main `DEPLOYMENT.md` for production build instructions.
