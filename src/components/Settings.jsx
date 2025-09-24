import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, CheckCircle, AlertCircle, Info, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { checkApiKeys, testAllConnections } from '../utils/apiIntegration'
import { checkSecureAPI } from '../utils/secureApiIntegration'

export const Settings = ({ isOpen, onClose, addToast }) => {
  const [preferredAI, setPreferredAI] = useState('claude') // claude, gpt4o, auto
  const [translationMode, setTranslationMode] = useState('translate') // translate or auto
  const [apiStatus, setApiStatus] = useState({
    openai: { success: false, message: 'Not tested' },
    claude: { success: false, message: 'Not tested' },
    summary: 'Click "Test APIs" to check connectivity'
  })
  const [isTestingApis, setIsTestingApis] = useState(false)

  const handleSave = () => {
    localStorage.setItem('preferredAI', preferredAI)
    localStorage.setItem('translationMode', translationMode)
    addToast('Settings saved successfully', 'success')
    onClose()
  }

  const handleReset = () => {
    setPreferredAI('claude')
    setTranslationMode('translate')
    localStorage.removeItem('preferredAI')
    localStorage.removeItem('translationMode')
    addToast('Settings reset to default', 'info')
  }

  const testApiConnections = async () => {
    setIsTestingApis(true)
    try {
      // Check if we're in production (Vercel deployment) or if secure APIs are available
      const isProduction = import.meta.env.PROD
      
      // Try to check if secure APIs are available
      let hasSecureAPIs = false
      try {
        hasSecureAPIs = await checkSecureAPI()
      } catch (error) {
        console.log('Secure APIs not available, using direct API calls')
        hasSecureAPIs = false
      }
      
      if (isProduction && hasSecureAPIs) {
        // In production with secure APIs available, test the secure serverless functions
        console.log('🔍 Testing secure serverless functions...')
        const results = await testSecureAPIs()
        setApiStatus(results)
        addToast(results.summary, results.openai.success || results.claude.success ? 'success' : 'error')
      } else {
        // In development or when secure APIs are not available, test direct API connections
        console.log('🔍 Testing direct API connections...')
        console.log('OpenAI Key:', import.meta.env.VITE_OPENAI_API_KEY)
        console.log('Claude Key:', import.meta.env.VITE_CLAUDE_API_KEY)
        
        const results = await testAllConnections()
        setApiStatus(results)
        addToast(results.summary, results.openai.success || results.claude.success ? 'success' : 'error')
      }
    } catch (error) {
      addToast('Failed to test API connections', 'error')
      console.error('API test error:', error)
    } finally {
      setIsTestingApis(false)
    }
  }

  // Test secure serverless functions in production
  const testSecureAPIs = async () => {
    const results = {
      openai: { success: false, message: 'Not tested' },
      claude: { success: false, message: 'Not tested' },
      summary: 'Testing secure APIs...'
    }

    try {
      // Test transcription API
      const testResponse = await fetch('/api/transcribe', {
        method: 'OPTIONS'
      })
      
      if (testResponse.ok) {
        results.openai = {
          success: true,
          message: '✅ Secure transcription API available'
        }
      } else {
        results.openai = {
          success: false,
          message: '❌ Transcription API not available'
        }
      }
    } catch (error) {
      results.openai = {
        success: false,
        message: `❌ Transcription API error: ${error.message}`
      }
    }

    try {
      // Test summarization API
      const testResponse = await fetch('/api/summarize', {
        method: 'OPTIONS'
      })
      
      if (testResponse.ok) {
        results.claude = {
          success: true,
          message: '✅ Secure summarization API available'
        }
      } else {
        results.claude = {
          success: false,
          message: '❌ Summarization API not available'
        }
      }
    } catch (error) {
      results.claude = {
        success: false,
        message: `❌ Summarization API error: ${error.message}`
      }
    }

    // Generate summary
    const workingApis = []
    if (results.openai?.success) workingApis.push('Transcription')
    if (results.claude?.success) workingApis.push('Summarization')
    
    if (workingApis.length === 0) {
      results.summary = '❌ No secure APIs are working. Check Vercel environment variables.'
    } else if (workingApis.length === 2) {
      results.summary = '✅ All secure APIs are working correctly!'
    } else {
      results.summary = `⚠️ Only ${workingApis.join(' and ')} API is working.`
    }

    return results
  }

  // Load settings from localStorage on component mount
  useEffect(() => {
    if (isOpen) {
      const savedAI = localStorage.getItem('preferredAI') || 'claude'
      const savedMode = localStorage.getItem('translationMode') || 'translate'
      setPreferredAI(savedAI)
      setTranslationMode(savedMode)
      
      // Check API keys availability
      const keyStatus = checkApiKeys()
      if (!keyStatus.hasAny) {
        setApiStatus({
          openai: { success: false, message: 'API key not configured' },
          claude: { success: false, message: 'API key not configured' },
          summary: '❌ No API keys found. Please configure your .env file.'
        })
      }
    }
  }, [isOpen])

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* AI Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                AI Provider for Analysis
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="aiProvider"
                    value="claude"
                    checked={preferredAI === 'claude'}
                    onChange={(e) => setPreferredAI(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Claude (Recommended)</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Best for complex analysis, action item extraction, and meeting insights
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="aiProvider"
                    value="gpt4o"
                    checked={preferredAI === 'gpt4o'}
                    onChange={(e) => setPreferredAI(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">GPT-4o</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Advanced reasoning, excellent for strategic analysis and insights
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="aiProvider"
                    value="auto"
                    checked={preferredAI === 'auto'}
                    onChange={(e) => setPreferredAI(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Auto (Claude + GPT-4o fallback)</span>
                      <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Uses Claude first, falls back to GPT-4o if Claude fails
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Translation Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Language Processing
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="translationMode"
                    value="translate"
                    checked={translationMode === 'translate'}
                    onChange={(e) => setTranslationMode(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Translate to English</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Transcribe any language and translate to English (Recommended)
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="translationMode"
                    value="auto"
                    checked={translationMode === 'auto'}
                    onChange={(e) => setTranslationMode(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Auto-detect Language</span>
                      <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Keep original language, auto-detect what's spoken
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* API Status */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  API Status
                </label>
                <button
                  onClick={testApiConnections}
                  disabled={isTestingApis}
                  className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTestingApis ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wifi className="w-3 h-3" />
                  )}
                  <span>{isTestingApis ? 'Testing...' : 'Test APIs'}</span>
                </button>
              </div>
              
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  apiStatus.openai.success ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center space-x-2">
                    {apiStatus.openai.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-gray-900">OpenAI (Whisper + GPT-4o)</span>
                  </div>
                  <span className={`text-xs ${apiStatus.openai.success ? 'text-green-600' : 'text-red-600'}`}>
                    {apiStatus.openai.success ? 'Connected' : 'Failed'}
                  </span>
                </div>
                
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  apiStatus.claude.success ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center space-x-2">
                    {apiStatus.claude.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-gray-900">Claude API</span>
                  </div>
                  <span className={`text-xs ${apiStatus.claude.success ? 'text-green-600' : 'text-red-600'}`}>
                    {apiStatus.claude.success ? 'Connected' : 'Failed'}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{apiStatus.summary}</p>
                {apiStatus.openai?.error && (
                  <p className="text-xs text-red-600 mt-1">OpenAI: {apiStatus.openai.error}</p>
                )}
                {apiStatus.claude?.error && (
                  <p className="text-xs text-red-600 mt-1">Claude: {apiStatus.claude.error}</p>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Advanced AI Integration:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>Whisper:</strong> Industry-leading speech-to-text transcription</li>
                    <li>• <strong>Claude:</strong> Best for complex analysis and action item extraction</li>
                    <li>• <strong>GPT-4o:</strong> Advanced reasoning and strategic insights</li>
                    <li>• <strong>Smart Fallback:</strong> Automatic switching if one AI fails</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="btn-secondary"
            >
              Reset to Default
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
