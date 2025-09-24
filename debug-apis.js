#!/usr/bin/env node

/**
 * API Debugging Script for Audio Summarizer
 * 
 * This script helps you test your API connections and debug issues.
 * Run with: node debug-apis.js
 */

import { config } from 'dotenv'
import fetch from 'node-fetch'

// Load environment variables
config()

const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY
const CLAUDE_API_KEY = process.env.VITE_CLAUDE_API_KEY

console.log('🔍 Audio Summarizer API Debug Tool\n')

// Check if .env file exists and has keys
console.log('📋 Environment Check:')
console.log(`   .env file loaded: ${process.env.NODE_ENV !== undefined ? '✅' : '❌'}`)
console.log(`   OpenAI API Key: ${OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`)
console.log(`   Claude API Key: ${CLAUDE_API_KEY ? '✅ Set' : '❌ Missing'}\n`)

if (!OPENAI_API_KEY && !CLAUDE_API_KEY) {
  console.log('❌ No API keys found!')
  console.log('📝 To fix this:')
  console.log('   1. Copy env.template to .env')
  console.log('   2. Add your actual API keys to .env')
  console.log('   3. Restart your development server\n')
  process.exit(1)
}

// Test OpenAI API
async function testOpenAI() {
  if (!OPENAI_API_KEY) {
    console.log('⏭️  Skipping OpenAI test (no API key)')
    return { success: false, message: 'No API key' }
  }

  console.log('🧪 Testing OpenAI API...')
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`   ✅ OpenAI API working! Found ${data.data?.length || 0} models`)
    return { success: true, models: data.data?.length || 0 }
  } catch (error) {
    console.log(`   ❌ OpenAI API failed: ${error.message}`)
    return { success: false, error: error.message }
  }
}

// Test Claude API
async function testClaude() {
  if (!CLAUDE_API_KEY) {
    console.log('⏭️  Skipping Claude test (no API key)')
    return { success: false, message: 'No API key' }
  }

  console.log('🧪 Testing Claude API...')
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{
          role: 'user',
          content: 'Hello'
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`   ✅ Claude API working! Response: "${data.content?.[0]?.text || 'No text'}"`)
    return { success: true, response: data.content?.[0]?.text }
  } catch (error) {
    console.log(`   ❌ Claude API failed: ${error.message}`)
    return { success: false, error: error.message }
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Running API tests...\n')
  
  const openaiResult = await testOpenAI()
  console.log('')
  const claudeResult = await testClaude()
  console.log('')

  // Summary
  console.log('📊 Test Results Summary:')
  const workingApis = []
  if (openaiResult.success) workingApis.push('OpenAI')
  if (claudeResult.success) workingApis.push('Claude')

  if (workingApis.length === 0) {
    console.log('   ❌ No APIs are working!')
    console.log('\n🔧 Troubleshooting:')
    console.log('   • Check your API keys are correct')
    console.log('   • Verify you have credits/quota remaining')
    console.log('   • Check your internet connection')
    console.log('   • Try the API keys in a different tool first')
  } else if (workingApis.length === 2) {
    console.log('   ✅ All APIs are working perfectly!')
    console.log('\n🎉 Your audio summarizer should work correctly!')
  } else {
    console.log(`   ⚠️  Only ${workingApis.join(' and ')} is working`)
    console.log('\n💡 The app will use fallback mode for the non-working API')
  }

  console.log('\n📝 Next steps:')
  console.log('   1. Start your development server: npm run dev')
  console.log('   2. Open the app in your browser')
  console.log('   3. Go to Settings and click "Test APIs"')
  console.log('   4. Try uploading an audio file')
}

// Run the tests
runTests().catch(console.error)
