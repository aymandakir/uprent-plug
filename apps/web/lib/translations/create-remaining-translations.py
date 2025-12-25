#!/usr/bin/env python3
# Helper script to track progress
import os

completed = ['en', 'nl', 'de', 'ar', 'ru', 'fr', 'es', 'it', 'pl', 'pt', 'ja', 'zh-CN']
all_langs = ['en', 'nl', 'de', 'ar', 'ru', 'fr', 'es', 'it', 'pl', 'pt', 'ja', 'zh-CN', 
             'ko', 'tr', 'vi', 'th', 'id', 'hi', 'sv', 'no', 'da', 'fi', 'cs', 'ro', 'hu', 'el']

remaining = [l for l in all_langs if l not in completed and l != 'en']
print(f"Completed: {len(completed)}/{len([l for l in all_langs if l != 'en'])}")
print(f"Remaining ({len(remaining)}): {', '.join(remaining)}")
