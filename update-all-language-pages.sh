#!/bin/bash
# Script to update all remaining language pages
LANG_PAGES=(
  "ar:ar_SA:Arabic"
  "ru:ru_RU:Russian"
  "fr:fr_FR:French"
  "es:es_ES:Spanish"
  "it:it_IT:Italian"
  "pl:pl_PL:Polish"
  "pt:pt_PT:Portuguese"
  "ja:ja_JP:Japanese"
  "zh-CN:zh_CN:Chinese"
  "ko:ko_KR:Korean"
  "sv:sv_SE:Swedish"
)

for lang_info in "${LANG_PAGES[@]}"; do
  IFS=':' read -r code locale name <<< "$lang_info"
  echo "Would create/update app/${code}/page.tsx with locale ${locale}"
done
