# Phase 4: Build TestFlight Version - Setup Complete ✅

## Overview

Complete guide and setup for building iOS app for TestFlight/internal distribution.

## Step 4.1: Prepare Assets ✅

### Documentation Created

1. **`apps/mobile/ASSETS_GUIDE.md`**
   - Detailed guide for creating app icon and splash screen
   - Requirements (sizes, formats)
   - Multiple options for creating assets
   - Verification steps

### Required Assets

**App Icon:**
- File: `apps/mobile/assets/icon.png`
- Size: 1024x1024 PNG
- Status: ⚠️ **Needs to be created** (see ASSETS_GUIDE.md)

**Splash Screen:**
- File: `apps/mobile/assets/splash.png`
- Size: 2048x2048 PNG
- Status: ⚠️ **Needs to be created** (see ASSETS_GUIDE.md)

**Current Assets:**
- Check `apps/mobile/assets/` directory
- Verify files exist and have correct dimensions

### Quick Asset Creation Options

1. **Option 1: Use Existing Logo**
   - Resize Uprent Plus logo to 1024x1024
   - Use for icon and splash

2. **Option 2: Create in Figma/Canva**
   - Design centered logo
   - Export at required sizes

3. **Option 3: Generate with AI**
   - Use DALL-E/Midjourney
   - Prompt: "Modern app icon for rental property app, simple design"

4. **Option 4: Simple Placeholder (Quick)**
   - Create colored square with logo
   - Replace with proper design later

## Step 4.2: Initialize EAS ✅

### Documentation Created

1. **`apps/mobile/TESTFLIGHT_BUILD.md`**
   - Complete build and distribution guide
   - EAS initialization steps
   - Environment variable configuration
   - Build commands
   - Troubleshooting

### EAS Configuration

**Current Status:**
- `eas.json` exists ✅
- `app.json` has EAS project ID placeholder
- Need to run `eas init` to link project

### Next Steps

1. **Login to Expo:**
   ```bash
   cd apps/mobile
   eas login
   ```

2. **Initialize EAS Project:**
   ```bash
   eas init
   ```
   - This will link/create project
   - Updates `app.json` with project ID

3. **Configure Environment Variables:**
   ```bash
   eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://uprent-plug-web.vercel.app --type string
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value your-supabase-url --type string
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value your-anon-key --type string
   ```

## Step 4.3: Build for iOS (Preview) ✅

### Build Commands

**Preview Build (Internal Distribution):**
```bash
cd apps/mobile
eas build --profile preview --platform ios
```

**Expected Timeline:**
- Build time: 15-30 minutes
- Queue time (free tier): Varies (can be hours)
- Total: 30 minutes - 4 hours depending on tier

### Build Profiles

From `eas.json`:

- **development**: Simulator builds
- **preview**: Internal distribution (install on devices)
- **production**: App Store / TestFlight

### Monitoring Build

```bash
# Check status
eas build:list

# View specific build
eas build:view BUILD_ID

# Download build
eas build:download --latest --platform ios
```

## Step 4.4: Internal Distribution Setup ✅

### Option A: Install on Your iPhone

**Steps:**

1. **Get iPhone UDID:**
   - Settings → General → About → Identifier
   - Or Finder → Select iPhone → Copy Identifier

2. **Register Device:**
   ```bash
   eas device:create
   ```

3. **Rebuild:**
   ```bash
   eas build --profile preview --platform ios
   ```

4. **Install:**
   - EAS sends install link via email
   - Open link on iPhone
   - Follow installation prompts
   - Trust developer certificate in Settings

### Option B: TestFlight (Production)

**For TestFlight:**

1. **Build Production:**
   ```bash
   eas build --profile production --platform ios
   ```

2. **Submit to TestFlight:**
   ```bash
   eas submit --platform ios --profile production
   ```

3. **See `DEPLOYMENT.md` for complete TestFlight setup.**

### Option C: Simulator Only (Fast Demo)

**If meeting is soon:**

```bash
# Development build for simulator
eas build --profile development --platform ios

# Or just use Expo Go
npx expo start
# Press 'i' for iOS Simulator
```

**This is fine for first meetings!**

## Files Created

1. ✅ `apps/mobile/ASSETS_GUIDE.md` - Asset creation guide
2. ✅ `apps/mobile/TESTFLIGHT_BUILD.md` - Complete build guide
3. ✅ `PHASE4_TESTFLIGHT.md` - This file

## Checklist

### Before Building

- [ ] Create app icon (1024x1024 PNG)
- [ ] Create splash screen (2048x2048 PNG)
- [ ] Verify assets in `apps/mobile/assets/`
- [ ] Login to EAS: `eas login`
- [ ] Initialize EAS project: `eas init`
- [ ] Set environment variables as secrets
- [ ] Update `app.json` with EAS project ID (after `eas init`)

### Building

- [ ] Run preview build: `eas build --profile preview --platform ios`
- [ ] Monitor build status
- [ ] Download build when complete

### Distribution

- [ ] Option A: Register device and install on iPhone
- [ ] Option B: Build production and submit to TestFlight
- [ ] Option C: Use simulator for quick demo

## Quick Start (Fastest Path)

**For immediate demo (no TestFlight):**

```bash
# 1. Create placeholder assets (or skip if using Expo Go)
# See ASSETS_GUIDE.md

# 2. Start Expo dev server
cd apps/mobile
npx expo start

# 3. Press 'i' for iOS Simulator
# Demo in simulator - works great for meetings!
```

**For TestFlight (takes longer):**

1. Create proper assets
2. Initialize EAS
3. Build production
4. Submit to TestFlight
5. Wait for review (~24-48 hours)

## Troubleshooting

See `TESTFLIGHT_BUILD.md` for:
- Build failures
- Missing assets
- Environment variables
- Device registration
- Installation issues

## Next Steps

1. **Create assets** (see `ASSETS_GUIDE.md`)
2. **Initialize EAS** (run `eas init`)
3. **Set secrets** (environment variables)
4. **Build preview** (for device testing)
5. **Or build production** (for TestFlight)

---

**Status:** ✅ Phase 4 Documentation Complete  
**Date:** January 25, 2025  
**Note:** Assets need to be created before building

