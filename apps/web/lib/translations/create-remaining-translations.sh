#!/bin/bash
# This script creates placeholder translation files with the same structure
# Real translations should be AI-generated for quality
echo "Creating remaining translation files..."
for lang in ru fr es it pl pt ja zh-CN ko tr vi th id hi sv no da fi cs ro hu el; do
  if [ ! -f "$lang.ts" ]; then
    echo "Creating $lang.ts..."
    cat > "$lang.ts" << FILEEOF
// This translation file needs to be populated with AI-generated translations
// Use the English source (en.ts) as reference
export const $lang = {
  metadata: {
    title: '',
    description: '',
  },
  hero: {
    badge: '',
    title: '',
    subtitle: '',
    cta: {
      primary: '',
      secondary: '',
    },
    trustBadge: '',
    searchPlaceholder: '',
  },
  // ... (structure matches en.ts)
} as const;
FILEEOF
  fi
done
