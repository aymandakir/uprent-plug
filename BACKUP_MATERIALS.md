# Backup Materials Guide

Guide for creating backup materials (screenshots and demo video) in case live demo fails.

## Creating Screenshots

### Method 1: iOS Simulator (Recommended)

1. **Start the app in simulator:**
   ```bash
   cd apps/mobile
   npx expo start
   # Press 'i' for iOS Simulator
   ```

2. **Navigate to each screen**

3. **Take screenshot:**
   - Simulator menu → File → Save Screen (Cmd+S)
   - OR: Device → Screenshots → Save Screen
   - Screenshots save to Desktop by default

4. **Required Screenshots:**
   - [ ] Welcome screen
   - [ ] Sign in screen
   - [ ] Dashboard (with stats)
   - [ ] Matches feed (with properties)
   - [ ] Property detail (with images)
   - [ ] AI letter generator form
   - [ ] AI letter generator result (with generated letter)
   - [ ] Saved properties grid
   - [ ] Profile/settings
   - [ ] Push notification settings

### Method 2: Physical iPhone

1. **Take screenshot:**
   - iPhone: Volume Up + Side Button (or Home + Power on older devices)
   - Screenshots save to Photos app

2. **Transfer to Mac:**
   - AirDrop: Select screenshots → Share → AirDrop → Mac
   - OR: Connect iPhone → Photos app → Import

### Screenshot Organization

```bash
# Create folder
mkdir -p demo-materials/screenshots

# Rename screenshots descriptively
mv ~/Desktop/Screen*.png demo-materials/screenshots/
# Then rename manually:
# - 01-welcome.png
# - 02-dashboard.png
# - 03-matches-feed.png
# - 04-property-detail.png
# - 05-letter-generator-form.png
# - 06-letter-generator-result.png
# - 07-saved-properties.png
# - 08-profile.png
# - 09-settings.png
```

**Screenshot Checklist:**
- [ ] Welcome screen
- [ ] Dashboard with populated data
- [ ] Matches feed (multiple properties visible)
- [ ] Property detail (with image gallery)
- [ ] AI letter generator (form filled out)
- [ ] AI letter generator (generated letter visible)
- [ ] Saved properties grid
- [ ] Profile screen
- [ ] Notification settings

---

## Recording Demo Video

### Method 1: QuickTime Player (Mac) - Recommended

1. **Open QuickTime Player:**
   - Applications → QuickTime Player
   - OR: Spotlight → "QuickTime Player"

2. **Start recording:**
   - File → New Screen Recording
   - OR: Cmd+Control+Shift+5 (Screenshot toolbar)

3. **Select recording area:**
   - Click record button
   - Select iOS Simulator window
   - Click "Start Recording"

4. **Record demo flow:**
   - Follow demo script
   - Keep recording smooth (no pauses)
   - Narrate key features
   - 3-5 minutes total

5. **Stop recording:**
   - Menu bar → Stop button
   - OR: Cmd+Control+Esc

6. **Save video:**
   - File → Save (Cmd+S)
   - Name: `demo-video.mov`
   - Location: `demo-materials/`

### Method 2: iPhone Screen Recording

1. **Enable screen recording:**
   - Settings → Control Center → Screen Recording (+)
   - Control Center → Screen Recording icon (circular)

2. **Start recording:**
   - Swipe down for Control Center
   - Tap Screen Recording
   - 3-second countdown
   - Recording starts

3. **Record demo:**
   - Navigate through app
   - Follow demo script

4. **Stop recording:**
   - Control Center → Tap red recording button
   - Recording saves to Photos

5. **Transfer to Mac:**
   - AirDrop or connect iPhone

### Method 3: OBS Studio (Advanced)

1. **Download OBS Studio:**
   - https://obsproject.com

2. **Configure:**
   - Add Source → Window Capture
   - Select iOS Simulator
   - Set output format (MP4 recommended)

3. **Record:**
   - Click "Start Recording"
   - Follow demo script
   - Click "Stop Recording"

### Video Recording Tips

**Before Recording:**
- [ ] Demo account logged in
- [ ] Dashboard populated with data
- [ ] App tested and working
- [ ] Close unnecessary apps
- [ ] Clear desktop/notifications
- [ ] Practice demo flow once

**During Recording:**
- [ ] Speak clearly
- [ ] Move slowly through screens
- [ ] Pause briefly on key features
- [ ] Show actual data (not empty states)
- [ ] Demonstrate AI letter generation
- [ ] Keep recording smooth (no rapid clicking)

**Video Checklist:**
- [ ] Introduction (30 seconds)
- [ ] Dashboard overview (1 minute)
- [ ] Matches feed (1.5 minutes)
- [ ] Property detail (30 seconds)
- [ ] AI letter generator - full flow (1.5 minutes)
- [ ] Saved properties (30 seconds)
- [ ] Wrap up (30 seconds)
- [ ] Total: 5-7 minutes

---

## Organizing Backup Materials

### Folder Structure

```bash
demo-materials/
├── demo-video.mov           # Recorded demo video
├── screenshots/
│   ├── 01-welcome.png
│   ├── 02-dashboard.png
│   ├── 03-matches-feed.png
│   ├── 04-property-detail.png
│   ├── 05-letter-generator-form.png
│   ├── 06-letter-generator-result.png
│   ├── 07-saved-properties.png
│   ├── 08-profile.png
│   └── 09-settings.png
└── README.txt               # Quick reference (optional)
```

### Creating Demo Materials Folder

```bash
# Create folder
mkdir -p demo-materials/screenshots

# Move screenshots
mv ~/Desktop/Screen*.png demo-materials/screenshots/

# Move video (if recorded)
mv demo-video.mov demo-materials/

# Verify
ls -lh demo-materials/
```

### Quick Reference File

Create `demo-materials/README.txt`:

```
Uprent Plus Mobile - Demo Backup Materials

Video:
- demo-video.mov (5-7 minutes, full demo flow)

Screenshots:
1. Welcome screen
2. Dashboard with stats
3. Matches feed
4. Property detail
5. AI letter generator form
6. AI letter generator result
7. Saved properties
8. Profile
9. Settings

Demo Script: See DEMO_SCRIPT.md
```

---

## Using Backup Materials During Demo

### If Live Demo Fails

1. **Quick Switch:**
   - "Let me show you the recorded demo"
   - Play `demo-materials/demo-video.mov`
   - Narrate while video plays

2. **Using Screenshots:**
   - Open screenshots folder
   - Navigate through screenshots in order
   - Explain each screen
   - "This shows the AI letter generator..."

3. **Hybrid Approach:**
   - Use screenshots for key features
   - Switch to video for complex flows (like AI generation)
   - Continue with live demo when ready

### Presenting Screenshots

**Option 1: Slideshow**
- Use Preview (Mac) or Photos app
- Full screen mode
- Navigate with arrow keys

**Option 2: Finder**
- Open screenshots folder
- Quick Look (Spacebar) for each
- Navigate with arrow keys

**Option 3: PDF**
- Combine screenshots into PDF
- Use Preview or Keynote
- Present as slideshow

### Video Presentation Tips

1. **Play video full screen**
2. **Pause at key moments** to explain
3. **Rewind if needed** to show specific features
4. **Mute if you want to narrate** instead of video audio

---

## Checklist

### Before Meeting

- [ ] Screenshots taken (all key screens)
- [ ] Screenshots organized in folder
- [ ] Demo video recorded
- [ ] Demo video saved to `demo-materials/`
- [ ] Backup materials tested (can open/play)
- [ ] Folder structure organized
- [ ] Quick reference created (optional)

### During Demo

- [ ] Backup materials accessible
- [ ] Can quickly switch if needed
- [ ] Know how to present screenshots
- [ ] Video player ready

---

## Tips for Better Materials

### Screenshots

- ✅ Use populated data (not empty states)
- ✅ Show actual property matches
- ✅ Include generated letter in screenshot
- ✅ Show stats with real numbers
- ✅ Use consistent screen size (iPhone 15 Pro recommended)

### Video

- ✅ Record at 1080p or higher
- ✅ Include narration or subtitles
- ✅ Keep video under 7 minutes
- ✅ Show actual data (demo account)
- ✅ Smooth transitions between screens
- ✅ Pause on key features

---

**Last Updated:** January 25, 2025

