# TestFlight Build Guide

Complete guide for building and distributing the iOS app via TestFlight.

## Prerequisites

- ✅ Apple Developer Account ($99/year)
- ✅ EAS account (free tier works)
- ✅ App assets prepared (icon, splash screen)
- ✅ Environment variables configured

## Step 1: Prepare Assets

See `ASSETS_GUIDE.md` for detailed instructions.

**Required:**
- `apps/mobile/assets/icon.png` (1024x1024)
- `apps/mobile/assets/splash.png` (2048x2048)

**Verify assets exist:**
```bash
cd apps/mobile/assets
ls -lh icon.png splash.png
```

## Step 2: Initialize EAS Project

### 2.1: Login to Expo

```bash
cd apps/mobile
eas login
```

If you don't have an account:
- Go to https://expo.dev
- Sign up (free)
- Login via CLI

### 2.2: Initialize EAS (if not done)

```bash
cd apps/mobile
eas init
```

This will:
- Ask to link to existing project or create new
- Generate EAS project ID
- Update `app.json` with project ID

**Note:** If `eas.json` already exists and has project ID, you can skip this step.

### 2.3: Configure Environment Variables

Set secrets in EAS (available during builds):

```bash
# API URL
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://uprent-plug-web.vercel.app --type string

# Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value https://your-project.supabase.co --type string

# Supabase Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value your-anon-key-here --type string

# Optional: EAS Project ID (if needed)
# eas secret:create --scope project --name EXPO_PUBLIC_EAS_PROJECT_ID --value your-project-id --type string
```

**To update existing secrets:**
```bash
eas secret:delete --scope project --name EXPO_PUBLIC_API_URL
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value new-value --type string
```

**To list secrets:**
```bash
eas secret:list --scope project
```

## Step 3: Build for iOS (Preview)

### 3.1: Preview Build (Internal Distribution)

```bash
cd apps/mobile
eas build --profile preview --platform ios
```

**This will:**
1. Upload your code to EAS servers
2. Build .ipa file in the cloud
3. Take 15-30 minutes (may queue on free tier)
4. Show build URL: `https://expo.dev/accounts/yourname/projects/uprent-plus/builds/abc123`

**While waiting:**
- Check build status: Visit the build URL
- Continue with next steps (device registration)
- Build status updates via email

### 3.2: Monitor Build

```bash
# Check build status
eas build:list

# View specific build
eas build:view BUILD_ID
```

**Build statuses:**
- `in-queue` - Waiting to start
- `in-progress` - Building now
- `finished` - Build complete
- `errored` - Build failed (check logs)

### 3.3: Download Build

After build completes:

1. **Via CLI:**
   ```bash
   eas build:download --latest --platform ios
   ```

2. **Via Dashboard:**
   - Go to build URL
   - Click "Download" button
   - Get .ipa file

## Step 4: Internal Distribution Setup

### Option A: Install on Your iPhone (No App Store)

**4.1: Get iPhone UDID**

**Method 1: Via iPhone Settings**
1. iPhone → Settings → General → About
2. Scroll to find "Identifier" (UDID)
3. Tap to copy

**Method 2: Via Mac Finder**
1. Connect iPhone to Mac
2. Open Finder
3. Select iPhone in sidebar
4. Click on device name/icon
5. Find "Identifier" (UDID)
6. Right-click → Copy

**Method 3: Via Terminal (Mac)**
```bash
# Connect iPhone via USB
system_profiler SPUSBDataType | grep -A 11 iPhone
# Look for "Serial Number" - this is UDID
```

**4.2: Register Device in EAS**

```bash
eas device:create
```

This will:
- Prompt for device name (e.g., "My iPhone")
- Prompt for UDID (paste from step 4.1)
- Register device for development builds

**4.3: Rebuild with Device Registered**

```bash
eas build --profile preview --platform ios
```

**4.4: Install on iPhone**

After build completes:

1. **Via Email:**
   - EAS sends install link to your email
   - Open email on iPhone
   - Tap install link
   - Follow prompts to install

2. **Via Build URL:**
   - Open build URL on iPhone
   - Tap "Install" button
   - Follow prompts

3. **Via QR Code:**
   - Build page shows QR code
   - Scan with iPhone camera
   - Tap notification to install

**4.5: Trust Developer Certificate (First Install)**

After installing:
1. iPhone → Settings → General → VPN & Device Management
2. Tap on developer certificate
3. Tap "Trust [Developer Name]"
4. App will now open

### Option B: TestFlight Distribution (Recommended for Demos)

For TestFlight, you need a production build:

```bash
eas build --profile production --platform ios
```

Then submit to TestFlight:
```bash
eas submit --platform ios --profile production
```

**See `DEPLOYMENT.md` for complete TestFlight setup.**

## Step 5: Alternative - Simulator Build (Faster for Meetings)

If your meeting is soon and you don't have time for TestFlight:

**Build for Simulator:**

```bash
eas build --profile development --platform ios
```

**Install on Simulator:**
1. Download .tar.gz file
2. Extract
3. Drag .app to Simulator

**Or use Expo Go for quick demos:**
```bash
npx expo start
# Press 'i' for iOS Simulator
```

This is actually fine for first meetings/demos!

## Troubleshooting

### Build Fails: "Missing assets"

**Error:** `Icon file doesn't exist: ./assets/icon.png`

**Fix:**
```bash
cd apps/mobile/assets
# Ensure icon.png and splash.png exist
ls -lh *.png
# If missing, create them (see ASSETS_GUIDE.md)
```

### Build Fails: "Environment variable not found"

**Error:** `EXPO_PUBLIC_API_URL is not defined`

**Fix:**
```bash
# Set secrets in EAS
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value your-value --type string
# Rebuild
eas build --profile preview --platform ios
```

### Build Queued for Hours

**Issue:** Build stuck in queue (free tier limitation)

**Fix:**
- Wait (free tier can queue for hours)
- Upgrade to paid EAS plan for faster builds
- Build during off-peak hours (usually faster)

### Device Not Registered

**Error:** "Device not registered" when installing

**Fix:**
```bash
# Register device
eas device:create
# Rebuild
eas build --profile preview --platform ios
```

### App Won't Open After Install

**Fix:**
1. iPhone → Settings → General → VPN & Device Management
2. Trust developer certificate
3. Try opening app again

## Build Profiles Explained

From `eas.json`:

- **development**: Simulator builds, development client
- **preview**: Internal distribution, install on devices
- **production**: App Store / TestFlight builds

## Next Steps

After successful preview build:

1. ✅ Test app on physical device
2. ✅ Fix any device-specific issues
3. ✅ Build production version for TestFlight
4. ✅ Submit to TestFlight for beta testing

---

**Last Updated:** January 25, 2025

