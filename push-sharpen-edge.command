#!/bin/bash
# Push Sharpen Your Edge to production
# Double-click this file in Finder to run, or paste the commands into Terminal

cd "$(dirname "$0")"

# Remove stale git lock if present
rm -f .git/index.lock

# Stage the new tool files
git add tools/sharpen-your-edge/ netlify/functions/sharpen-edge-capture.js tools/index.html

# Commit
git commit -m "Add Sharpen Your Edge tool + tools index card"

# Push — Netlify auto-deploys on push to main
git push origin main

echo ""
echo "Done. Netlify will deploy in ~1 minute."
echo "Live at: https://brandthnk.co/tools/sharpen-your-edge/"
echo ""
read -p "Press any key to close..."
