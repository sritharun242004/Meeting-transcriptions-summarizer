#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Meeting Transcription & Summarization App...\n')

// Check if .env file exists
const envPath = path.join(__dirname, '.env')
const envTemplatePath = path.join(__dirname, 'env.template')

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envTemplatePath)) {
    fs.copyFileSync(envTemplatePath, envPath)
    console.log('✅ Created .env file from template')
    console.log('📝 Please edit .env file and add your API keys\n')
  } else {
    console.log('⚠️  No .env template found. Please create .env file manually\n')
  }
} else {
  console.log('✅ .env file already exists\n')
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules')
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...')
  console.log('Run: npm install\n')
} else {
  console.log('✅ Dependencies already installed\n')
}

console.log('🎉 Setup complete!')
console.log('\nNext steps:')
console.log('1. Edit .env file and add your API keys (optional for demo)')
console.log('2. Run: npm install')
console.log('3. Run: npm run dev')
console.log('4. Open http://localhost:3000 in your browser')
console.log('\n📚 See README.md for detailed instructions and API integration guide')

