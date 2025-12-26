# App Assets Guide

## Required Assets for iOS Build

### 1. App Icon (1024x1024 PNG)

**File:** `apps/mobile/assets/icon.png`

**Requirements:**
- Size: 1024x1024 pixels (exact)
- Format: PNG with transparency (or no transparency, both work)
- No rounded corners (iOS adds them automatically)
- No drop shadows or borders

**Creating the Icon:**

**Option 1: Use Existing Logo**
- If you have an Uprent Plus logo, resize it to 1024x1024
- Use image editing software (Photoshop, GIMP, Preview on Mac)
- Ensure it's centered and has padding (don't fill entire canvas)

**Option 2: Create in Figma/Canva**
1. Create 1024x1024 canvas
2. Add your logo/design centered
3. Leave 10-15% padding on edges
4. Export as PNG

**Option 3: Generate with AI**
- Use DALL-E, Midjourney, or similar
- Prompt: "Create modern app icon for rental property app, simple design, house/apartment icon, blue/purple gradient background, 1024x1024"
- Edit to ensure it meets requirements

**Quick Test:**
```bash
cd apps/mobile/assets
file icon.png  # Should show: PNG image data, 1024 x 1024
```

### 2. Splash Screen (2048x2048 PNG)

**File:** `apps/mobile/assets/splash.png`

**Requirements:**
- Size: 2048x2048 pixels (exact)
- Format: PNG
- Simple design: Centered logo on dark background (#000000 recommended)
- No text (text won't scale well)

**Creating the Splash:**

**Simple Design (Recommended):**
1. Create 2048x2048 canvas
2. Fill background: #000000 (black) or #1A1A1A (dark gray)
3. Center your logo/icon in the middle
4. Logo should be ~30-40% of canvas size
5. Export as PNG

**Option: Use Same Icon**
- Use your app icon, but larger (or same size)
- Center it on dark background
- Ensure it looks good when displayed

**Quick Test:**
```bash
cd apps/mobile/assets
file splash.png  # Should show: PNG image data, 2048 x 2048
```

### 3. Adaptive Icon (Android - 1024x1024 PNG)

**File:** `apps/mobile/assets/adaptive-icon.png`

**Requirements:**
- Size: 1024x1024 pixels
- Format: PNG
- Icon should be centered
- Safe area: Keep important content within center 70% (will be masked)

**Note:** Android adaptive icons can be same as iOS icon, but ensure important content is in center 70% area.

## Asset Checklist

- [ ] `apps/mobile/assets/icon.png` (1024x1024)
- [ ] `apps/mobile/assets/splash.png` (2048x2048)
- [ ] `apps/mobile/assets/adaptive-icon.png` (1024x1024) - Optional for iOS, required for Android

## Verification

Check that assets are properly referenced in `app.json`:

```bash
cd apps/mobile
cat app.json | grep -A 3 "icon\|splash"
```

Should show:
```json
"icon": "./assets/icon.png",
"splash": {
  "image": "./assets/splash.png",
  ...
}
```

## Quick Placeholder Assets

If you need to proceed quickly and can update later, you can create simple placeholder assets:

**Simple Icon (using ImageMagick or online tool):**
```bash
# Create simple colored square as placeholder (replace later!)
# This is just to get the build working
```

**Recommended:** Create proper assets before building for TestFlight, as users will see these.

## Resources

- [Expo App Icon Guidelines](https://docs.expo.dev/app-icons/)
- [Expo Splash Screen Guidelines](https://docs.expo.dev/app-icons/)
- [iOS Human Interface Guidelines - App Icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)

---

**Last Updated:** January 25, 2025

