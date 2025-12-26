# Full Flow Testing Checklist

Complete testing checklist for the mobile app before demo/meeting.

## Pre-Testing Setup

```bash
cd apps/mobile
npx expo start --clear
# Press 'i' for iOS Simulator
```

## Testing Checklist

### Authentication Flow

- [ ] **Welcome Screen**
  - [ ] Welcome screen loads correctly
  - [ ] "Get Started" button visible and works
  - [ ] "Sign In" button visible and works
  - [ ] Layout looks good on different screen sizes

- [ ] **Sign Up**
  - [ ] Tap "Get Started" → Sign up screen opens
  - [ ] Enter new email (e.g., `test+$(date +%s)@example.com`)
  - [ ] Enter password (min 8 chars)
  - [ ] Submit form → Account created successfully
  - [ ] No errors in terminal
  - [ ] Redirects to onboarding

- [ ] **Onboarding**
  - [ ] Shows 3 swipeable cards
  - [ ] Can swipe between cards
  - [ ] "Get Started" button visible on last card
  - [ ] Tap "Get Started" → Redirects to dashboard

- [ ] **Sign In**
  - [ ] Sign out (if signed in)
  - [ ] Tap "Sign In"
  - [ ] Enter existing credentials
  - [ ] Submit → Dashboard loads
  - [ ] Session persists (close/reopen app)

- [ ] **Password Reset**
  - [ ] Tap "Forgot Password"
  - [ ] Enter email
  - [ ] Submit → Email sent confirmation
  - [ ] Check email for reset link (optional)

### Dashboard Flow

- [ ] **Dashboard Loads**
  - [ ] Stats cards display correctly
  - [ ] Numbers match expected values (may be 0 if no data)
  - [ ] Loading state shows initially
  - [ ] No errors in terminal

- [ ] **Stats Cards**
  - [ ] Active Searches count
  - [ ] New Matches count
  - [ ] Saved Properties count
  - [ ] Applications count
  - [ ] Cards are tappable (if clickable)

- [ ] **Quick Actions**
  - [ ] 4 action buttons visible
  - [ ] "Create Search Profile" navigates
  - [ ] "Browse Matches" navigates
  - [ ] "AI Letter Generator" navigates
  - [ ] "View Applications" navigates

- [ ] **Activity Feed**
  - [ ] Recent activities display
  - [ ] Activities are tappable
  - [ ] Pull-to-refresh works
  - [ ] Empty state shows if no activities

### Matches Flow

- [ ] **Matches Tab**
  - [ ] Navigate to Matches tab
  - [ ] Property list loads
  - [ ] Properties display with images
  - [ ] Match scores visible
  - [ ] Pull-to-refresh works

- [ ] **Property Card**
  - [ ] Images display correctly
  - [ ] Price shows correctly
  - [ ] Address shows correctly
  - [ ] Bedrooms/bathrooms show
  - [ ] Save button (heart icon) works
  - [ ] Tap card → Property detail opens

- [ ] **Property Detail**
  - [ ] All property info displays
  - [ ] Image gallery swipes correctly
  - [ ] Image dots indicate current image
  - [ ] Address, price, details correct
  - [ ] Features list shows
  - [ ] Map preview works (if available)
  - [ ] Back button works

- [ ] **Property Actions**
  - [ ] "Generate Application Letter" button visible
  - [ ] "Contact Landlord" button works
  - [ ] "Save Property" button works
  - [ ] Share button works (opens share sheet)

### AI Letter Generator

- [ ] **Access Generator**
  - [ ] Tap "Generate Letter" from property detail
  - [ ] OR Tap from dashboard quick actions
  - [ ] Modal opens correctly

- [ ] **Form Inputs**
  - [ ] Language selector shows 29 languages
  - [ ] Tone selector works (Professional/Friendly/Enthusiastic)
  - [ ] Length selector works (Short/Medium/Long)
  - [ ] Key points text input works
  - [ ] Personal info fields auto-fill (if available)

- [ ] **Generation**
  - [ ] Tap "Generate" button
  - [ ] Loading state shows
  - [ ] Letter generates in 5-10 seconds
  - [ ] Preview displays correctly
  - [ ] No errors

- [ ] **Letter Actions**
  - [ ] Copy to clipboard works
  - [ ] Toast notification shows "Copied"
  - [ ] Share button works
  - [ ] Email button works (opens mail app)
  - [ ] Regenerate button works

### Saved Properties

- [ ] **Saved Tab**
  - [ ] Navigate to Saved tab
  - [ ] Saved properties display
  - [ ] Grid layout works (2 columns)
  - [ ] Images load correctly
  - [ ] Pull-to-refresh works

- [ ] **Save/Unsave**
  - [ ] From matches, save a property
  - [ ] Property appears in Saved tab
  - [ ] Unsave from Saved tab
  - [ ] Property removed from Saved

- [ ] **Batch Actions** (if implemented)
  - [ ] Select mode activates
  - [ ] Can select multiple properties
  - [ ] Batch unsave works

### Profile & Settings

- [ ] **Profile Tab**
  - [ ] Navigate to Profile tab
  - [ ] User info displays correctly
  - [ ] Avatar shows (if uploaded)
  - [ ] Subscription tier displays

- [ ] **Settings**
  - [ ] Edit profile opens
  - [ ] Name/email can be updated
  - [ ] Changes save correctly
  - [ ] Notification settings accessible
  - [ ] App settings work

- [ ] **Subscription**
  - [ ] Subscription status displays
  - [ ] "Upgrade to Premium" button works
  - [ ] Stripe checkout opens (if not Premium)
  - [ ] Manage subscription works (if Premium)

- [ ] **Sign Out**
  - [ ] Tap "Sign Out"
  - [ ] Confirmation alert (if implemented)
  - [ ] Session cleared
  - [ ] Redirects to welcome screen

### Demo Account

- [ ] **Login with Demo**
  - [ ] Sign in with `demo@uprentplus.com`
  - [ ] Password: `Demo123456!`
  - [ ] Login succeeds
  - [ ] Dashboard shows populated data
  - [ ] 15 matches visible
  - [ ] 5 saved properties visible
  - [ ] Stats show correct numbers

### Edge Cases

- [ ] **Empty States**
  - [ ] No matches → Empty state shows
  - [ ] No saved properties → Empty state shows
  - [ ] No activities → Empty state shows

- [ ] **Error Handling**
  - [ ] Network error → Error message shows
  - [ ] API error → Error message shows
  - [ ] Retry button works

- [ ] **Loading States**
  - [ ] Initial load shows loading spinner
  - [ ] Skeleton loaders show (if implemented)
  - [ ] Pull-to-refresh shows loading

- [ ] **Performance**
  - [ ] App starts quickly (< 3 seconds)
  - [ ] Navigation is smooth
  - [ ] Images load progressively
  - [ ] No lag when scrolling
  - [ ] No memory leaks (test for 10+ minutes)

### Device Testing

- [ ] **iPhone SE (Smallest)**
  - [ ] All text visible (no cutoff)
  - [ ] Buttons accessible
  - [ ] Layout works correctly

- [ ] **iPhone 15 Pro (Standard)**
  - [ ] Everything looks good
  - [ ] Proper spacing

- [ ] **iPhone 15 Pro Max (Largest)**
  - [ ] Content doesn't stretch oddly
  - [ ] Images scale correctly

## Bug Tracking

**Critical Bugs (Fix Immediately):**
- [ ] App crashes
- [ ] Login doesn't work
- [ ] Data doesn't load
- [ ] AI generator fails

**Major Bugs (Fix Before Demo):**
- [ ] UI elements not visible
- [ ] Navigation broken
- [ ] Images not loading
- [ ] Forms don't submit

**Minor Bugs (Fix If Time):**
- [ ] Small UI inconsistencies
- [ ] Loading states could be better
- [ ] Animations could be smoother

## Notes

- Test with demo account: `demo@uprentplus.com` / `Demo123456!`
- Check terminal for errors during testing
- Take screenshots of any bugs
- Document any issues found

---

**Last Updated:** January 25, 2025

