#!/bin/bash

# BrandThnk Website Deployment Check
# Run this script to verify if your changes deployed successfully

echo "🔍 Checking BrandThnk website deployment..."
echo ""

# Get the latest commit hash
LATEST_COMMIT=$(git rev-parse --short HEAD)
echo "Latest local commit: $LATEST_COMMIT"

# Check if the site is responding
echo ""
echo "📡 Checking site status..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://brandthnk.co)

if [ "$STATUS_CODE" = "200" ]; then
    echo "✅ Site is online (HTTP $STATUS_CODE)"
else
    echo "❌ Site issue (HTTP $STATUS_CODE)"
fi

# Check last deployment time
echo ""
echo "🕒 To check deployment status:"
echo "   Netlify Admin: https://app.netlify.com/projects/stalwart-basbousa-6cbbc8/deploys"
echo "   Site URL: https://brandthnk.co"

echo ""
echo "🚀 If auto-deployment failed, run manual deployment:"
echo "   netlify deploy --prod"

echo ""
echo "✨ Quick verification checklist:"
echo "   □ Check Netlify admin for latest deployment"
echo "   □ Clear browser cache and refresh site"
echo "   □ Verify specific changes are visible"
echo "   □ Test any new functionality"