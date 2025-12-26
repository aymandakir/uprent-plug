# Quick Build Checklist

Quick reference for building the iOS app.

## Assets Status

**Current Assets:**
- ✅ `icon.png` exists (22K)
- ⚠️ `splash-icon.png` exists (17K) - using as splash screen
- ✅ `adaptive-icon.png` exists (17K)

**Note:** `splash-icon.png` is being used as splash screen. For production, consider creating a dedicated `splash.png` (2048x2048).

## Quick Start (For Immediate Demo)

**Option 1: Simulator (Fastest - 2 minutes)**
```bash
cd apps/mobile
npx expo start
# Press 'i' for iOS Simulator
```
✅ Works immediately  
✅ No build needed  
✅ Perfect for meetings/demos

## Full Build Process

### Step 1: Prepare Assets (if needed)

**Verify assets:**
```bash
cd apps/mobile/assets
ls -lh *.png
```

**If missing, create:**
- See `ASSETS_GUIDE.md` for details
- Icon: 1024x1024 PNG
- Splash: 2048x2048 PNG (or use existing splash-icon.png)

### Step 2: Initialize EAS

```bash
cd apps/mobile
eas login
eas init
```

This will:
- Link to/create EAS project
- Update `app.json` with project ID

### Step 3: Set Environment Variables

```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://uprent-plug-web.vercel.app --type string
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value your-supabase-url --type string
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value your-anon-key --type string
```

### Step 4: Build

**Preview Build (Internal Distribution):**
```bash
eas build --profile preview --platform ios
```

**Timeline:**
- Build: 15-30 minutes
- Queue (free tier): Variable (can be hours)
- Total: 30 min - 4 hours

### Step 5: Install on Device

**Register Device:**
```bash
# Get UDID from iPhone Settings → General → About
eas device:create
```

**Rebuild with device:**
```bash
eas build --profile preview --platform ios
```

**Install:**
- EAS sends install link via email
- Open link on iPhone
- Trust certificate: Settings → General → VPN & Device Management

## Production Build (TestFlight)

```bash
# Build production
eas build --profile production --platform ios

# Submit to TestFlight
eas submit --platform ios --profile production
```

**Timeline:**
- Build: 15-30 minutes
- TestFlight review: 24-48 hours

See `TESTFLIGHT_BUILD.md` for complete details.

---

**For quick demos, just use the simulator!**

