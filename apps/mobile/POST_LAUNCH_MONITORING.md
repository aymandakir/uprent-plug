# Post-Launch Monitoring Setup

## Overview

Guide for setting up monitoring, analytics, and error tracking after app launch.

## 1. Error Tracking with Sentry

### Installation

```bash
cd apps/mobile
npx expo install @sentry/react-native
```

### Configuration

Create `apps/mobile/sentry.config.js`:

```javascript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  enableInExpoDevelopment: false,
  debug: __DEV__,
  tracesSampleRate: 1.0, // Adjust based on volume
});
```

Update `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "sentry-expo",
        {
          "organization": "your-org",
          "project": "uprent-plus-mobile",
          "authToken": ""
        }
      ]
    ]
  }
}
```

Update `app/_layout.tsx`:

```typescript
import * as Sentry from '@sentry/react-native';

// Initialize Sentry (if not using expo plugin)
// Sentry.init({...});

export default function RootLayout() {
  // ... existing code
}
```

### Error Boundaries

Wrap app in error boundary:

```typescript
import * as Sentry from '@sentry/react-native';

<Sentry.Native.ErrorBoundary fallback={ErrorFallback}>
  <YourApp />
</Sentry.Native.ErrorBoundary>
```

### Set EAS Secret

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value your-sentry-dsn
```

### What to Monitor

- Crash-free rate (target: >99%)
- Error rates by screen/feature
- JavaScript errors
- Native crashes
- Network errors
- Performance issues

## 2. Analytics

### Option 1: Expo Analytics (Free)

Already included with Expo. Basic usage:

```typescript
import { Analytics } from 'expo-analytics';

Analytics.logEvent('screen_view', {
  screen_name: 'Dashboard',
});
```

### Option 2: Firebase Analytics

Install:

```bash
npx expo install @react-native-firebase/analytics
```

Configure:

```typescript
import analytics from '@react-native-firebase/analytics';

// Track screen view
analytics().logScreenView({
  screen_name: 'Dashboard',
  screen_class: 'DashboardScreen',
});

// Track event
analytics().logEvent('property_saved', {
  property_id: '123',
  price: 1500,
});
```

### Events to Track

**Screen Views:**
- Dashboard
- Matches
- Property Detail
- Saved Properties
- Profile
- AI Letter Generator
- Contract Analyzer
- Notifications

**User Actions:**
- `property_saved` - Property saved
- `property_unsaved` - Property unsaved
- `letter_generated` - AI letter generated
- `contract_analyzed` - Contract analyzed
- `notification_opened` - Notification tapped
- `search_profile_created` - Search profile created
- `subscription_upgraded` - Premium upgrade
- `application_submitted` - Application submitted

**Business Metrics:**
- `sign_up` - User registration
- `sign_in` - User login
- `subscription_started` - Subscription purchased
- `subscription_cancelled` - Subscription cancelled

## 3. Performance Monitoring

### Sentry Performance

Already included with Sentry setup. Monitor:

- API response times
- Screen load times
- Image load performance
- Navigation performance
- App startup time

### Custom Performance Tracking

```typescript
import * as Sentry from '@sentry/react-native';

const transaction = Sentry.startTransaction({
  name: 'API Call',
  op: 'http.request',
});

// ... API call

transaction.finish();
```

## 4. User Feedback

### In-App Feedback Form

Create `apps/mobile/components/FeedbackForm.tsx`:

```typescript
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useToast } from '@/hooks/use-toast';

export function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    // Send to backend API or email
    // Include app version, device info
    toast.show.success('Thank you for your feedback!');
    setFeedback('');
  };

  return (
    // Form UI
  );
}
```

Add to Profile screen:

```typescript
<TouchableOpacity onPress={() => router.push('/(app)/feedback')}>
  <Text>Send Feedback</Text>
</TouchableOpacity>
```

### App Store Review Prompt

Prompt after positive interactions:

```typescript
import * as StoreReview from 'expo-store-review';

// After successful action (e.g., property saved, letter generated)
if (await StoreReview.isAvailableAsync()) {
  await StoreReview.requestReview();
}
```

## 5. Key Metrics Dashboard

### Metrics to Track

**User Metrics:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- User retention:
  - Day 1 retention
  - Day 7 retention
  - Day 30 retention

**Feature Adoption:**
- % users who create search profile
- % users who save properties
- % users who generate AI letters
- % users who analyze contracts
- % users who upgrade to Premium

**Engagement:**
- Average session duration
- Screens per session
- Properties viewed per user
- Notifications opened rate
- Matches saved rate

**Business Metrics:**
- Free → Basic conversion rate
- Basic → Premium conversion rate
- Subscription retention
- Monthly Recurring Revenue (MRR)
- Customer Lifetime Value (CLV)

**Technical Metrics:**
- Crash-free rate (>99% target)
- API error rate (<1% target)
- Average API response time
- App startup time
- Screen load times

### Create Dashboard

Use one of:
- Sentry Dashboard (errors, performance)
- Firebase Analytics Dashboard
- Custom dashboard with backend metrics
- Mixpanel / Amplitude (advanced)

## 6. Alerting

### Set Up Alerts

**Critical Alerts:**
- Crash-free rate drops below 99%
- API error rate > 5%
- Subscription payment failures
- Database connection issues

**Warning Alerts:**
- API response time > 2 seconds
- High error rate on specific screen
- Low user retention
- Feature adoption drops

### Alert Channels

- Email notifications
- Slack/Discord webhooks
- PagerDuty (for critical)

## 7. Logging Strategy

### What to Log

**Error Logs:**
- All exceptions with stack traces
- API errors with request/response
- Navigation errors
- Authentication failures

**Info Logs:**
- Feature usage
- User actions
- API calls (with timing)
- Performance metrics

**Debug Logs (Development Only):**
- Component renders
- State changes
- API requests/responses

### Log Levels

- `error` - Errors that need attention
- `warn` - Warnings that might be issues
- `info` - Important events
- `debug` - Development debugging

## 8. Regular Monitoring Tasks

### Daily
- [ ] Check crash-free rate
- [ ] Review error reports
- [ ] Check API error rates
- [ ] Monitor user feedback

### Weekly
- [ ] Review analytics dashboard
- [ ] Analyze feature adoption
- [ ] Review user retention metrics
- [ ] Check performance metrics
- [ ] Review subscription metrics

### Monthly
- [ ] Analyze user growth trends
- [ ] Review conversion funnel
- [ ] Analyze subscription churn
- [ ] Review most common errors
- [ ] Performance optimization opportunities

## 9. Response Procedures

### Critical Bug Found

1. Assess severity and impact
2. Create hotfix build
3. Submit urgent update to stores
4. Communicate to users (if needed)
5. Monitor resolution

### Performance Degradation

1. Identify bottleneck
2. Optimize code
3. Push OTA update (if JS-only)
4. Submit new build (if native changes)
5. Monitor improvement

### High Error Rate

1. Identify error source
2. Fix root cause
3. Deploy fix
4. Monitor error rate reduction

## 10. Update Strategy

### OTA Updates (JavaScript Only)

For bug fixes and small improvements:

```bash
# Create update
eas update --branch production --message "Bug fixes and improvements"

# Users receive on next app launch
# No App Store review needed
```

**Best for:**
- Bug fixes
- UI improvements
- Feature toggles
- Text changes

### New Builds (Native Changes)

For new dependencies, native modules, version bumps:

```bash
# Build new version
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android

# App Store review required
```

**Required for:**
- New native dependencies
- Permission changes
- Bundle ID changes
- Major version bumps
- New native features

## Tools Integration Checklist

- [ ] Sentry DSN configured
- [ ] Analytics initialized
- [ ] Error boundaries in place
- [ ] Performance monitoring active
- [ ] User feedback form added
- [ ] App Store review prompt implemented
- [ ] Alerts configured
- [ ] Dashboard created
- [ ] Monitoring schedule established

---

**Status:** Ready for implementation  
**Last Updated:** January 25, 2025

