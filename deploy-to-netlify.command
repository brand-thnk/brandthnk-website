#!/bin/bash
# BrandThnk — Deploy to Netlify (double-click to run)

SITE_DIR="/Users/allisonnetzer/Documents/BrandThnk/website"
cd "$SITE_DIR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  BrandThnk → Netlify Deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for netlify CLI
if command -v netlify &> /dev/null; then
  NETLIFY_CMD="netlify"
elif [ -f "$SITE_DIR/node_modules/.bin/netlify" ]; then
  NETLIFY_CMD="$SITE_DIR/node_modules/.bin/netlify"
else
  echo "Netlify CLI not found locally. Using npx..."
  NETLIFY_CMD="npx netlify-cli@latest"
fi

echo "Deploying to production..."
echo ""
$NETLIFY_CMD deploy --prod --dir . --site 302e9489-21cd-4bf3-83c5-1542364fb062

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Done. Visit: https://brandthnk.co/tools/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Press Enter to close..."
