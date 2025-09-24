#!/bin/bash

# 🚀 Vercel Deployment Script
# This script helps you deploy your Meeting Transcription App to Vercel

echo "🚀 Starting Vercel Deployment Process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git not initialized. Please run 'git init' first."
    exit 1
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please ensure the file exists."
    exit 1
fi

echo "✅ Pre-deployment checks passed!"

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found after build."
    exit 1
fi

echo "✅ Build artifacts ready!"

# Git operations
echo "📝 Preparing for deployment..."

# Add all files
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit."
else
    # Commit changes
    git commit -m "Deploy to Vercel - $(date)"
    echo "✅ Changes committed to Git"
fi

# Push to remote
echo "📤 Pushing to remote repository..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to remote. Please check your Git configuration."
    exit 1
fi

echo "✅ Code pushed to remote repository!"

# Deployment instructions
echo ""
echo "🎉 Code is ready for Vercel deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Click 'New Project'"
echo "3. Import your Git repository"
echo "4. Configure environment variables:"
echo "   - OPENAI_API_KEY = your OpenAI key"
echo "   - CLAUDE_API_KEY = your Claude key"
echo "5. Click 'Deploy'"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - DEPLOYMENT_GUIDE.md"
echo "   - DEPLOYMENT_CHECKLIST.md"
echo "   - vercel-env-setup.md"
echo ""
echo "🔧 To test your APIs locally:"
echo "   node debug-apis.js"
echo ""
echo "✅ Deployment preparation complete!"
