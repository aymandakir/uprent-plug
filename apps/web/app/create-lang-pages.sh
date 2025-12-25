#!/bin/bash
langs=("nl" "ar" "ru" "zh-CN" "ja" "de" "it" "es" "pl" "fr" "pt" "ko" "tr" "vi" "th" "id" "hi" "sv" "no" "da" "fi" "cs" "ro" "hu" "el")

for lang in "${langs[@]}"; do
  mkdir -p "$lang"
  echo "Created directory: $lang"
done
