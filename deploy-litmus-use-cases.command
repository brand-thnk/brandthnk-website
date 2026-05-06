#!/bin/bash
cd "$(dirname "$0")"
echo "Adding litmus/use-cases page..."
git add litmus/use-cases/
git commit -m "Add Litmus use cases page"
echo "Pushing to GitHub (Netlify will auto-deploy)..."
git push
echo ""
echo "Done. Netlify will deploy in ~30 seconds."
echo "URL: https://brandthnk.co/litmus/use-cases"
echo ""
read -p "Press Enter to close..."
