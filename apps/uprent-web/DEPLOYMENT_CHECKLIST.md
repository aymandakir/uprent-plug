# Pre-Deployment Checklist

Use this checklist before submitting to app stores.

## Pre-Build Checklist

### Configuration
- [ ] `app.json` metadata complete
- [ ] Bundle identifiers correct (iOS & Android)
- [ ] Version numbers set correctly
- [ ] EAS project ID configured
- [ ] `eas.json` configured with build profiles

### Environment Variables
- [ ] `EXPO_PUBLIC_API_URL` set in EAS secrets
- [ ] `EXPO_PUBLIC_SUPABASE_URL` set in EAS secrets
- [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY` set in EAS secrets
- [ ] `EXPO_PUBLIC_EAS_PROJECT_ID` set in EAS secrets

### Assets
- [ ] App icon (1024x1024 PNG) created
- [ ] Splash screen (2048x2048 PNG) created
- [ ] Adaptive icon (Android, 1024x1024 PNG) created
- [ ] Notification icon (optional, 96x96 PNG) created
- [ ] All assets are in `assets/` folder

### Code
- [ ] All tests pass
- [ ] No console.log statements in production code
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] Offline handling tested

### Permissions
- [ ] iOS permissions configured in `app.json`
- [ ] Android permissions configured in `app.json`
- [ ] Permission usage descriptions provided

## App Store Connect (iOS)

### App Information
- [ ] App created in App Store Connect
- [ ] Bundle ID matches: `com.uprentplus.mobile`
- [ ] App Store Connect App ID noted
- [ ] Apple Team ID noted
- [ ] Apple ID configured in `eas.json`

### App Store Listing
- [ ] App name: "Uprent Plus"
- [ ] Subtitle entered
- [ ] Category selected
- [ ] Privacy policy URL provided
- [ ] Support URL provided
- [ ] Marketing URL (if applicable)
- [ ] Age rating completed

### Screenshots
- [ ] 6.7" screenshots (1290x2796) - 3-5 screens
- [ ] 6.5" screenshots (1242x2688) - 3-5 screens
- [ ] 5.5" screenshots (1242x2208) - 3-5 screens
- [ ] App preview video (optional)

### App Description
- [ ] Short description (170 chars)
- [ ] Full description (4000 chars)
- [ ] Keywords added (100 chars max)
- [ ] Promo text (170 chars)

### Pricing
- [ ] Price tier selected (Free)
- [ ] Availability countries selected

## Google Play Console (Android)

### App Information
- [ ] App created in Play Console
- [ ] Package name matches: `com.uprentplus.mobile`
- [ ] Service account created (for automated submission)
- [ ] Service account JSON key downloaded (`google-play-key.json`)
- [ ] Service account permissions granted in Play Console

### Store Listing
- [ ] App name: "Uprent Plus"
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Phone screenshots (min 2, max 8)
- [ ] Tablet screenshots (7", min 1)
- [ ] Promo video (optional)

### Content Rating
- [ ] Content rating questionnaire completed
- [ ] Rating received (typically "Everyone")

### Privacy Policy
- [ ] Privacy policy URL provided
- [ ] Privacy policy is publicly accessible
- [ ] Policy covers all data collection

### Pricing & Distribution
- [ ] App is free
- [ ] Countries selected for distribution

## Testing

### Internal Testing
- [ ] iOS preview build tested on device
- [ ] Android preview build tested on device
- [ ] All critical features work
- [ ] No crashes on main flows
- [ ] Performance acceptable

### TestFlight (iOS)
- [ ] Production build uploaded to TestFlight
- [ ] Internal testers added
- [ ] Test information provided
- [ ] App tested by testers
- [ ] Feedback collected and addressed

### Internal Testing Track (Android)
- [ ] Production build uploaded
- [ ] Internal testers added
- [ ] App tested by testers
- [ ] Feedback collected and addressed

## Build Commands

### iOS
```bash
# Production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

### Android
```bash
# Production build
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --profile production
```

## Post-Submission

### iOS
- [ ] Build submitted successfully
- [ ] Waiting for App Store review (7-14 days)
- [ ] Monitor App Store Connect for status updates
- [ ] Respond to review feedback if needed

### Android
- [ ] Build submitted successfully
- [ ] Waiting for Play Store review (1-3 days)
- [ ] Monitor Play Console for status updates
- [ ] Respond to review feedback if needed

## Post-Launch

### Monitoring
- [ ] Error tracking set up (Sentry)
- [ ] Analytics configured
- [ ] Crash reporting monitored
- [ ] User feedback mechanism in place

### Updates
- [ ] Plan for first update (bug fixes)
- [ ] OTA updates configured for JS-only changes
- [ ] Version increment strategy defined

## Sign-off

- [ ] All checklist items completed
- [ ] App tested thoroughly
- [ ] Ready for submission

**Prepared by:** _______________  
**Date:** _______________  
**App Version:** 1.0.0

