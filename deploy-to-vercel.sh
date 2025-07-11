#!/bin/bash

# Vercel Deployment Script
# This script helps prepare and deploy your portfolio to Vercel

echo "🚀 Preparing portfolio for Vercel deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git branch -M main"
    echo "   git remote add origin <your-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "📋 Deployment checklist:"
echo "1. ✅ vercel.json configuration file created"
echo "2. ✅ .vercelignore file created"
echo "3. ✅ Build test passed"
echo "4. ⚠️  Make sure to set up environment variables in Vercel dashboard:"
echo "   - DATABASE_URL (required)"
echo "   - MAILJET_API_KEY (optional, for contact form)"
echo "   - MAILJET_SECRET_KEY (optional, for contact form)"
echo ""
echo "🌐 Ready to deploy! Run: vercel"
echo "   Or visit: https://vercel.com/new and import your repository"
echo ""
echo "📚 For detailed instructions, see: VERCEL_DEPLOYMENT.md"