# Mobile App Deployment Guide

## Overview

Complete guide for building and deploying the Uprent Plus mobile app to iOS App Store and Google Play Store using EAS Build.

## Prerequisites

### Accounts Required

1. **Expo Account** (Free)
   - Sign up at https://expo.dev
   - Install EAS CLI: `npm install -g eas-cli`
   - Login: `eas login`

2. **Apple Developer Account** ($99/year)
   - Required for iOS App Store
   - Sign up at https://developer.apple.com
   - Enroll in Apple Developer Program

3. **Google Play Developer Account** ($25 one-time)
   - Required for Android Play Store
   - Sign up at https://play.google.com/console

### App Store Connect Setup (iOS)

1. Create app in App Store Connect
   - Go to https://appstoreconnect.apple.com
   - Create new app
   - Bundle ID: `com.uprentplus.mobile`
   - Get App Store Connect App ID (needed for `eas.json`)

2. Get Apple Team ID
   - In App Store Connect: Users and Access > Keys
   - Note your Team ID

### Google Play Console Setup (Android)

1. Create app in Play Console
   - Go to https://play.google.com/console
   - Create new app
   - Package name: `com.uprentplus.mobile`

2. Create Service Account (for automated submission)
   - Go to: Settings > API access
   - Create service account
   - Download JSON key file
   - Save as `google-play-key.json` in project root
   - Grant permissions in Play Console

## Step 1: Initialize EAS

```bash
cd apps/mobile

# Login to Expo
eas login

# Initialize EAS in project
eas init

# This will ask for:
# - EAS project ID (will be generated)
# - Update the project ID in app.json
```

## Step 2: Configure Environment Variables

Set secrets in EAS (they'll be available during builds):

```bash
# API URL
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://your-production-api.com --type string

# Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value https://your-project.supabase.co --type string

# Supabase Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value your-anon-key --type string

# EAS Project ID (from eas init)
eas secret:create --scope project --name EXPO_PUBLIC_EAS_PROJECT_ID --value your-project-id --type string
```

Update `app.json` with the EAS project ID:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    }
  }
}
```

Update `eas.json` with submit credentials:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

## Step 3: Prepare Assets

### App Icon
- Size: 1024x1024 PNG
- Location: `apps/mobile/assets/icon.png`
- No transparency
- Rounded corners will be added automatically

### Splash Screen
- Size: 2048x2048 PNG
- Location: `apps/mobile/assets/splash.png`
- Background color: #000000 (black)

### Adaptive Icon (Android)
- Size: 1024x1024 PNG
- Location: `apps/mobile/assets/adaptive-icon.png`
- Background color: #000000

### Notification Icon (Optional)
- Size: 96x96 PNG (white icon on transparent background)
- Location: `apps/mobile/assets/notification-icon.png`

## Step 4: Build iOS App

### Production Build

```bash
# Build for production
eas build --platform ios --profile production

# This will:
# 1. Upload your code to EAS servers
# 2. Build the app in the cloud (15-30 minutes)
# 3. Provide download link for .ipa file
```

### Preview Build (for testing)

```bash
eas build --platform ios --profile preview
```

### Development Build (for local testing)

```bash
eas build --platform ios --profile development
```

### Install on Device

1. Download .ipa from EAS dashboard
2. Install via:
   - TestFlight (recommended)
   - Or drag to Xcode > Devices window
   - Or use Apple Configurator

## Step 5: Submit iOS to App Store

### Option 1: Automated Submission (Recommended)

```bash
eas submit --platform ios --profile production
```

This requires:
- Apple ID in `eas.json`
- App Store Connect App ID
- Apple Team ID

### Option 2: Manual Submission

1. Download .ipa from EAS dashboard
2. Open **Transporter** app (Mac)
3. Drag .ipa file to Transporter
4. Click "Deliver"

### TestFlight Setup

1. In App Store Connect:
   - Go to TestFlight tab
   - Add internal testers (your team)
   - Add external testers (if needed)
   - Provide test information

2. Testers receive email invitation
3. Install TestFlight app
4. Accept invitation and install app
5. Test for 1-2 weeks before App Store release

### App Store Review Submission

1. Complete app metadata:
   - App description (short & long)
   - Keywords
   - Screenshots (required sizes):
     - iPhone 6.7" (iPhone 15 Pro Max): 1290x2796
     - iPhone 6.5" (iPhone XS Max): 1242x2688
     - iPhone 5.5" (iPhone 8 Plus): 1242x2208
   - App preview video (optional)
   - Promo text
   - Support URL
   - Marketing URL (optional)

2. Complete app information:
   - Privacy policy URL (required)
   - Age rating
   - App category
   - Subcategory

3. Submit for review
   - Review time: 7-14 days typically
   - Can take up to 24-48 hours for approval

## Step 6: Build Android App

### Production Build

```bash
eas build --platform android --profile production

# This builds an .aab (Android App Bundle) file
# Required for Google Play Store
```

### Preview Build (APK)

```bash
eas build --platform android --profile preview
# This builds an .apk file (for direct installation)
```

### Install APK on Device

1. Download .apk from EAS dashboard
2. Transfer to Android device
3. Enable "Install from unknown sources"
4. Tap .apk file to install

## Step 7: Submit Android to Play Store

### Option 1: Automated Submission

```bash
eas submit --platform android --profile production
```

This requires:
- `google-play-key.json` service account file
- Service account must have Play Console access

### Option 2: Manual Submission

1. Download .aab from EAS dashboard
2. Go to Google Play Console
3. Create new release
4. Upload .aab file
5. Add release notes
6. Review and roll out

### Play Store Listing

1. Complete store listing:
   - App name: "Uprent Plus"
   - Short description (80 chars max)
   - Full description (4000 chars max)
   - App icon: 512x512 PNG
   - Feature graphic: 1024x500 PNG
   - Screenshots:
     - Phone: Minimum 2, up to 8
     - 7" tablet: Minimum 1, up to 8
     - 10" tablet (optional)
   - Promo video (optional)

2. Complete content rating:
   - Fill out questionnaire
   - Get rating (typically "Everyone")

3. Complete privacy policy:
   - URL required
   - Must be publicly accessible

4. Set up pricing:
   - Free or paid
   - Countries/regions

5. Submit for review:
   - Review time: 1-3 days typically
   - Can be as fast as a few hours

## Screenshots Required

### iOS Screenshots

1. **6.7" Display (iPhone 15 Pro Max)**
   - Size: 1290 x 2796 pixels
   - Required: Yes

2. **6.5" Display (iPhone XS Max)**
   - Size: 1242 x 2688 pixels
   - Required: Yes

3. **5.5" Display (iPhone 8 Plus)**
   - Size: 1242 x 2208 pixels
   - Required: Yes

**Screens to capture:**
1. Dashboard (Home screen)
2. Matches feed
3. Property detail
4. AI Letter Generator
5. Notifications center
6. Profile/Settings

### Android Screenshots

1. **Phone**
   - Minimum 2 screenshots
   - Maximum 8 screenshots
   - Size: At least 320px, max 3840px height
   - Recommended: 1080x1920 (portrait)

2. **7" Tablet**
   - Minimum 1 screenshot
   - Maximum 8 screenshots
   - Recommended: 1920x1200

**Screens to capture:** Same as iOS

## App Store Metadata

### Short Description (iOS & Android)

```
Find your perfect rental 15 seconds faster with AI-powered alerts
```

### Long Description (iOS)

```
Uprent Plus - Your AI-Powered Rental Assistant

Stop missing out on your dream apartment. Uprent Plus monitors 1,500+ property sources in real-time and alerts you to new listings 15 seconds faster than anyone else.

KEY FEATURES:

⚡ Real-Time Alerts
Get instant push notifications the moment a new property matching your criteria appears. Never miss a listing again.

🤖 AI Application Letters
Generate personalized, compelling application letters in 29 languages. Stand out from the crowd with professional, tailored content created in seconds.

🎯 Smart Matching
Our intelligent algorithm analyzes thousands of properties and matches them to your preferences with a compatibility score.

📝 AI Contract Analysis (Premium)
Upload rental contracts and get instant AI-powered analysis. Identify red flags, understand terms, and get legal recommendations.

🔔 Multi-Channel Notifications
Receive alerts via email, push, SMS, and Telegram (Premium). Choose your preferred channels.

💰 Fair Pricing
- Free Trial: Get started with basic features
- Basic Plan: €14.99/month - Perfect for most users
- Premium Plan: €24.99/month - Full feature access

WHY UPRENT PLUS?

In the competitive Dutch rental market, speed matters. Properties get hundreds of applications within hours of being posted. Uprent Plus gives you the unfair advantage:

• 15-second alerts (vs. minutes or hours with manual checking)
• AI-powered letters that make you stand out
• Smart matching saves hours of browsing
• Contract analysis helps you avoid bad deals

Join thousands of renters who have found their perfect home faster with Uprent Plus.

Download now and get your first match within minutes.
```

### Long Description (Android)

Same as iOS (slightly adapted for Play Store formatting)

### Keywords (iOS)

```
rental, housing, apartment, property, Netherlands, Amsterdam, Rotterdam, Utrecht, AI, real estate, rental alerts, property search, housing market, rental application, tenant, landlord, smart matching
```

## Post-Launch: Over-The-Air (OTA) Updates

For JavaScript-only changes (no native code changes):

```bash
# Create update
eas update --branch production --message "Bug fixes and improvements"

# Users will receive update on next app launch
```

For native code changes (new dependencies, native modules):
- Must create new build
- Submit new version to app stores

## Version Management

### iOS Version

Update in `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    }
  }
}
```

For each release:
- Increment `version` (e.g., 1.0.0 → 1.0.1)
- Increment `buildNumber` (e.g., 1 → 2)

### Android Version

Update in `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

For each release:
- Increment `version` (e.g., 1.0.0 → 1.0.1)
- Increment `versionCode` (e.g., 1 → 2)

## Troubleshooting

### Build Failures

1. Check build logs in EAS dashboard
2. Common issues:
   - Missing environment variables
   - Invalid bundle identifier
   - Code signing issues (iOS)
   - Missing permissions

### Submission Failures

1. Check App Store Connect / Play Console for errors
2. Common issues:
   - Missing metadata
   - Screenshots not uploaded
   - Privacy policy URL invalid
   - Age rating not set

### Testing on Device

- Use preview builds for quick testing
- TestFlight (iOS) for beta testing
- Internal testing track (Android) for beta testing

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

---

**Last Updated:** January 25, 2025

