#!/bin/bash
echo "🚀 Deploying to Vercel..."
git add .
git commit -m "Fix PostCSS configuration for Vercel deployment"
git push
vercel --prod