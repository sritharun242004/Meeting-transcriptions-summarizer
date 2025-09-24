#!/bin/bash

# 🔧 Deployment Fix Script
# This script fixes common deployment issues

echo "🔧 Fixing deployment issues..."

# Clean build
echo "🧹 Cleaning previous build..."
rm -rf dist
rm -rf node_modules/.vite

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi

# Check if index.html exists and has content
if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html not found in dist folder!"
    exit 1
fi

# Check if the main JS file exists
JS_FILE=$(find dist/assets -name "index-*.js" | head -1)
if [ -z "$JS_FILE" ]; then
    echo "❌ Main JavaScript file not found!"
    exit 1
fi

echo "✅ Build successful!"
echo "📁 Build output:"
ls -la dist/
echo ""
echo "📄 index.html content:"
head -20 dist/index.html
echo ""
echo "🎯 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Fix deployment - build working'"
echo "3. git push origin main"
echo "4. Deploy to Vercel"
