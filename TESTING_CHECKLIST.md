# Mobile App Testing Checklist

## Pre-Deployment QA Testing Plan

### Authentication & Onboarding

#### Sign Up Flow
- [ ] **New user sign up**
  - [ ] Enter email and password
  - [ ] Password requirements enforced (min 8 chars)
  - [ ] Email validation works
  - [ ] Success message displays
  - [ ] Verification email sent (if required)
  - [ ] Redirects to onboarding or dashboard

- [ ] **Sign in**
  - [ ] Existing user can sign in
  - [ ] Invalid credentials show error
  - [ ] Forgot password link works
  - [ ] Redirects to dashboard after sign in

- [ ] **Password reset**
  - [ ] Request reset email
  - [ ] Email received with reset link
  - [ ] Reset link opens app (deep link)
  - [ ] Password can be changed
  - [ ] Can sign in with new password

- [ ] **Session management**
  - [ ] Session persists after closing app
  - [ ] Auto-login on app reopen (if session valid)
  - [ ] Session expires correctly
  - [ ] Sign out clears session
  - [ ] Sign out redirects to welcome screen

- [ ] **Onboarding**
  - [ ] Shows after first sign up
  - [ ] Swipeable cards work
  - [ ] Skip button works
  - [ ] "Get Started" completes onboarding
  - [ ] Onboarding doesn't show again

### Navigation

- [ ] **Tab navigation**
  - [ ] All tabs accessible
  - [ ] Active tab highlighted
  - [ ] Tab switching smooth
  - [ ] Badge count shows on Matches tab (if unread)

- [ ] **Deep linking**
  - [ ] Notification tap opens correct screen
  - [ ] Property link opens property detail
  - [ ] External links handled correctly

- [ ] **Back navigation**
  - [ ] Back button works on all screens
  - [ ] Swipe back gesture works (iOS)
  - [ ] Stack navigation maintains history

- [ ] **Modal screens**
  - [ ] Property detail modal opens/closes
  - [ ] Letter generator modal works
  - [ ] Subscription modal displays
  - [ ] Dismiss gesture works

### Dashboard (Home Tab)

- [ ] **Data loading**
  - [ ] Loading spinner shows initially
  - [ ] Stats cards display correctly:
    - [ ] Active Searches count
    - [ ] New Matches count
    - [ ] Saved Properties count
    - [ ] Applications count
  - [ ] Unread notification badge shows

- [ ] **Quick actions**
  - [ ] "Create Search Profile" navigates correctly
  - [ ] "Browse Matches" navigates to matches
  - [ ] "AI Letter Generator" opens generator
  - [ ] "View Applications" navigates correctly

- [ ] **Activity feed**
  - [ ] Shows recent activities
  - [ ] Tap activity navigates to detail
  - [ ] Empty state shows when no activity
  - [ ] Timestamps display correctly (relative time)

- [ ] **Pull-to-refresh**
  - [ ] Pull gesture triggers refresh
  - [ ] Data updates correctly
  - [ ] Loading indicator shows

- [ ] **Error handling**
  - [ ] Network error shows error view
  - [ ] Retry button works
  - [ ] Offline banner shows when disconnected

### Matches Tab

- [ ] **List display**
  - [ ] Matches load correctly
  - [ ] Property cards render with images
  - [ ] Match score badge displays
  - [ ] Price, address, size show correctly
  - [ ] Empty state shows when no matches

- [ ] **Filtering**
  - [ ] Filter button opens modal
  - [ ] Price range filter works
  - [ ] City filter works
  - [ ] Property type filter works
  - [ ] Min match score filter works
  - [ ] Apply filters updates list

- [ ] **Sorting**
  - [ ] Sort button opens modal
  - [ ] Sort by match score works
  - [ ] Sort by newest works
  - [ ] Sort by price (low to high) works
  - [ ] Sort by price (high to low) works
  - [ ] Active sort option highlighted

- [ ] **Interactions**
  - [ ] Tap card navigates to property detail
  - [ ] Save/unsave button works (heart icon)
  - [ ] Toast notification shows on save/unsave
  - [ ] Image carousel swipes correctly
  - [ ] Image dots indicator works

- [ ] **Performance**
  - [ ] List scrolls smoothly (60 FPS)
  - [ ] Images load progressively
  - [ ] Skeleton loader shows while loading

### Property Detail Screen

- [ ] **Layout**
  - [ ] Images load in gallery
  - [ ] Image swipe works
  - [ ] Dots indicator shows current image
  - [ ] Back button works
  - [ ] Share button works
  - [ ] Save button works

- [ ] **Property information**
  - [ ] Address displays correctly
  - [ ] Price shows correctly (€X/month)
  - [ ] Size shows (m²)
  - [ ] Bedrooms/bathrooms show
  - [ ] Property type displays
  - [ ] Description shows (expandable)
  - [ ] Features list shows:
    - [ ] Furnished
    - [ ] Pets allowed
    - [ ] Balcony
    - [ ] Elevator
    - [ ] Parking
  - [ ] Availability date shows

- [ ] **Actions**
  - [ ] "Generate Application Letter" navigates to generator
  - [ ] "Contact Landlord" opens email
  - [ ] "Save Property" toggles save state
  - [ ] Share sheet opens with property link

- [ ] **Loading & errors**
  - [ ] Loading spinner shows initially
  - [ ] Error view shows if property not found
  - [ ] Retry button works

### AI Letter Generator

- [ ] **Form inputs**
  - [ ] Language selector dropdown works
  - [ ] All 29 languages available
  - [ ] Tone buttons select correctly
  - [ ] Length buttons select correctly
  - [ ] Personal info fields editable
  - [ ] Key points textarea works
  - [ ] Property context displays

- [ ] **Generation**
  - [ ] Generate button triggers API call
  - [ ] Loading state shows during generation
  - [ ] Generated letter displays in preview
  - [ ] Letter is editable
  - [ ] Character count shows

- [ ] **Actions**
  - [ ] Copy to clipboard works
  - [ ] Toast shows on copy
  - [ ] Share button opens share sheet
  - [ ] Email button opens mail app
  - [ ] Regenerate button creates new letter

- [ ] **Error handling**
  - [ ] API error shows friendly message
  - [ ] Rate limit error shows
  - [ ] Network error shows
  - [ ] Offline shows "Requires Internet" message
  - [ ] Retry button works

### Saved Properties

- [ ] **List display**
  - [ ] Saved properties load
  - [ ] Grid layout (2 columns) displays correctly
  - [ ] Images load
  - [ ] Price and address show
  - [ ] Empty state shows when no saved properties

- [ ] **Interactions**
  - [ ] Tap property navigates to detail
  - [ ] Long press activates selection mode
  - [ ] Select all/deselect all works
  - [ ] Batch unsave works
  - [ ] Individual unsave works
  - [ ] Pull-to-refresh works

- [ ] **Selection mode**
  - [ ] Visual selection indicator shows
  - [ ] Selected count displays
  - [ ] Batch action bar shows
  - [ ] Cancel button exits selection mode

### Notifications

- [ ] **Push notifications**
  - [ ] Permission request on first launch
  - [ ] Permission granted registers token
  - [ ] Test notification received
  - [ ] Notification tap navigates to correct screen
  - [ ] Notification badge updates

- [ ] **Notification center**
  - [ ] List loads correctly
  - [ ] Grouped by date (Today, Yesterday, etc.)
  - [ ] Unread indicator shows (blue dot)
  - [ ] Tap notification navigates correctly
  - [ ] Swipe right marks as read
  - [ ] Swipe left deletes
  - [ ] Mark all as read works

- [ ] **Filters**
  - [ ] Filter tabs work (All, Matches, Applications, System)
  - [ ] Active filter highlighted
  - [ ] List filters correctly

### Profile & Settings

- [ ] **Profile display**
  - [ ] Avatar shows (or placeholder)
  - [ ] Name displays
  - [ ] Email displays
  - [ ] Subscription badge shows (Free/Basic/Premium)

- [ ] **Avatar upload**
  - [ ] Tap avatar opens image picker
  - [ ] Image selection works
  - [ ] Upload progress shows
  - [ ] Avatar updates after upload
  - [ ] Error handling works

- [ ] **Account settings**
  - [ ] Edit profile saves name
  - [ ] Change password sends email
  - [ ] Notification settings navigate correctly
  - [ ] Push notification toggle works
  - [ ] Settings persist after app restart

- [ ] **Subscription**
  - [ ] Current plan displays
  - [ ] "Upgrade to Premium" opens subscription screen
  - [ ] Subscription screen shows all tiers
  - [ ] Stripe checkout opens in web view
  - [ ] Success screen shows after payment
  - [ ] Profile updates with new subscription

- [ ] **App settings**
  - [ ] Privacy Policy link opens
  - [ ] Terms of Service link opens
  - [ ] App version displays correctly

- [ ] **Danger zone**
  - [ ] Sign out shows confirmation
  - [ ] Sign out clears session
  - [ ] Delete account shows confirmation
  - [ ] Delete account works (test on staging only!)

### Contract Analyzer (Premium)

- [ ] **Premium gate**
  - [ ] Non-premium users see upgrade screen
  - [ ] Benefits list displays
  - [ ] Upgrade button navigates correctly

- [ ] **Document upload**
  - [ ] File picker opens
  - [ ] PDF/DOC/DOCX files selectable
  - [ ] File name and size display
  - [ ] Change file button works

- [ ] **Analysis**
  - [ ] Analyze button triggers API call
  - [ ] Progress indicator shows
  - [ ] Results display:
    - [ ] Overall risk score (color-coded)
    - [ ] Risk level badge
    - [ ] Summary paragraph
    - [ ] Red flags list
    - [ ] Yellow flags list
    - [ ] Recommendations list

- [ ] **Error handling**
  - [ ] API errors show message
  - [ ] Network errors handled
  - [ ] File upload errors handled

### Edge Cases & Error Handling

- [ ] **Offline mode**
  - [ ] Offline banner shows when disconnected
  - [ ] Cached data displays
  - [ ] Online-only features show "Requires Internet"
  - [ ] Reconnection syncs data

- [ ] **Network conditions**
  - [ ] Slow network (throttled)
  - [ ] Request timeout handled
  - [ ] Loading states show appropriately
  - [ ] Error messages are user-friendly

- [ ] **Empty states**
  - [ ] No matches shows empty state
  - [ ] No saved properties shows empty state
  - [ ] No notifications shows empty state
  - [ ] Empty state CTAs navigate correctly

- [ ] **Error states**
  - [ ] 404 errors show friendly message
  - [ ] 401 errors redirect to sign in
  - [ ] 500 errors show retry option
  - [ ] Network errors show retry option

- [ ] **Data validation**
  - [ ] Long text truncates correctly
  - [ ] Special characters display correctly
  - [ ] Large images load without crashing
  - [ ] Missing data handled gracefully

- [ ] **Performance**
  - [ ] App launches in < 3 seconds
  - [ ] Screens load in < 1 second
  - [ ] List scrolling smooth (60 FPS)
  - [ ] Images load progressively
  - [ ] No memory leaks (check with profiler)

### Device Testing

- [ ] **iOS Devices**
  - [ ] iPhone 14/15 (latest iOS)
  - [ ] iPhone SE (smaller screen)
  - [ ] iPad (if supported)
  - [ ] Dark mode works correctly

- [ ] **Android Devices**
  - [ ] Pixel 7/8 (latest Android)
  - [ ] Samsung Galaxy (if available)
  - [ ] Different screen sizes

- [ ] **Screen sizes**
  - [ ] Small screens (iPhone SE)
  - [ ] Medium screens (iPhone 14)
  - [ ] Large screens (iPhone Pro Max)
  - [ ] Tablet (if supported)

### Accessibility

- [ ] **VoiceOver/TalkBack**
  - [ ] All buttons have labels
  - [ ] Navigation is accessible
  - [ ] Forms are accessible

- [ ] **Text scaling**
  - [ ] App works with large text sizes
  - [ ] Layout doesn't break

- [ ] **Color contrast**
  - [ ] Text is readable
  - [ ] Buttons have sufficient contrast

### Localization (if implemented)

- [ ] **Language switching**
  - [ ] Language selector works
  - [ ] UI text translates correctly
  - [ ] Dates format correctly
  - [ ] Numbers format correctly

## Testing Environment

### Staging Environment
- Use staging API endpoint
- Test with test Stripe keys
- Use staging Supabase instance

### Test Accounts
- Free tier account
- Basic tier account
- Premium tier account
- Test payment method

## Bug Reporting

When finding bugs, create GitHub Issues with:
- [ ] Clear title
- [ ] Steps to reproduce
- [ ] Expected behavior
- [ ] Actual behavior
- [ ] Screenshots/videos
- [ ] Device/OS information
- [ ] App version

## Sign-off

- [ ] All critical bugs fixed
- [ ] All high-priority items tested
- [ ] Performance acceptable
- [ ] No crashes on critical paths
- [ ] Ready for production deployment

**Tester:** _______________  
**Date:** _______________  
**Version:** _______________

