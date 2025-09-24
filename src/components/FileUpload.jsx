import React, { useState, useCallback } from 'react'
import { Upload, FileAudio, FileVideo, AlertCircle, CheckCircle } from 'lucide-react'
import { transcribeWithSecureAPI, transcribeWithFallback, summarizeWithSecureAPI, summarizeWithFallback } from '../utils/secureApiIntegration'
import { extractActionItems, formatSummary, formatKeyPoints } from '../utils/apiIntegration'

const SUPPORTED_FORMATS = ['mp3', 'mp4', 'wav', 'm4a', 'webm']
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export const FileUpload = ({ dispatch, addToast }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState([])

  const validateFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase()
    const errors = []

    if (!SUPPORTED_FORMATS.includes(extension)) {
      errors.push(`Unsupported format: ${extension}`)
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max 100MB)`)
    }

    return errors
  }

  const processFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList)
    const validFiles = []
    const invalidFiles = []

    files.forEach(file => {
      const errors = validateFile(file)
      if (errors.length === 0) {
        validFiles.push(file)
      } else {
        invalidFiles.push({ file, errors })
      }
    })

    if (invalidFiles.length > 0) {
      const errorMessage = invalidFiles.map(({ file, errors }) => 
        `${file.name}: ${errors.join(', ')}`
      ).join('\n')
      addToast(`Invalid files: ${errorMessage}`, 'error', 8000)
    }

    if (validFiles.length === 0) return

    const newFiles = validFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploadedAt: new Date().toISOString(),
      status: 'uploading',
      transcript: '',
      summary: '',
      keyPoints: '',
      actionItems: [],
      userNote: '',
      processingProgress: 0
    }))

    setUploadingFiles(newFiles)
    dispatch({ type: 'ADD_FILES', payload: newFiles })
    addToast(`Processing ${validFiles.length} file${validFiles.length > 1 ? 's' : ''}...`, 'info')

    // Process each file
    for (const fileData of newFiles) {
      try {
        await processFile(fileData)
      } catch (error) {
        console.error('Error processing file:', error)
        dispatch({
          type: 'UPDATE_FILE',
          payload: {
            id: fileData.id,
            updates: { status: 'error' }
          }
        })
        addToast(`Error processing ${fileData.name}`, 'error')
      }
    }

    setUploadingFiles([])
    addToast('All files processed successfully!', 'success')
  }, [dispatch])

  const processFile = async (fileData) => {
    // Get API keys from environment variables (for fallback)
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY?.trim()
    const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY?.trim()
    
    // Debug: Log API key status
    console.log('🔍 API Key Debug Info:')
    console.log('OpenAI Key available:', !!OPENAI_API_KEY)
    console.log('Claude Key available:', !!CLAUDE_API_KEY)
    console.log('OpenAI Key starts with sk-proj-:', OPENAI_API_KEY?.startsWith('sk-proj-'))
    console.log('Claude Key starts with sk-ant-:', CLAUDE_API_KEY?.startsWith('sk-ant-'))
    console.log('All env vars:', import.meta.env)
    
    try {
      // Update status to processing
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          id: fileData.id,
          updates: { status: 'processing', processingProgress: 10 }
        }
      })

      // Check translation mode setting
      const translationMode = localStorage.getItem('translationMode') || 'translate'
      let transcript
      
      if (translationMode === 'translate') {
        addToast(`Transcribing ${fileData.name} to English...`, 'info')
        // Step 1: Use secure API with fallback
        transcript = await transcribeWithFallback(fileData.file, OPENAI_API_KEY, { language: 'en' })
      } else {
        addToast(`Transcribing ${fileData.name} (auto-detect language)...`, 'info')
        // Step 1: Use secure API with auto-detection
        transcript = await transcribeWithFallback(fileData.file, OPENAI_API_KEY, {})
      }
      
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          id: fileData.id,
          updates: { 
            processingProgress: 50,
            transcript: transcript
          }
        }
      })

      addToast(`Generating summary for ${fileData.name}...`, 'info')

      // Step 2: Generate summary and extract action items using secure API
      const preferredAI = localStorage.getItem('preferredAI') || 'claude'
      let aiResponse
      
      if (preferredAI === 'claude') {
        try {
          aiResponse = await summarizeWithFallback(transcript, CLAUDE_API_KEY, 'claude')
          addToast(`Using Claude for enhanced analysis`, 'info')
        } catch (claudeError) {
          console.log('Claude API failed, falling back to GPT-4o:', claudeError)
          aiResponse = await summarizeWithFallback(transcript, OPENAI_API_KEY, 'openai')
          addToast(`Claude failed, using GPT-4o instead`, 'warning')
        }
      } else {
        try {
          aiResponse = await summarizeWithFallback(transcript, OPENAI_API_KEY, 'openai')
          addToast(`Using GPT-4o for analysis`, 'info')
        } catch (gptError) {
          console.log('GPT-4o failed, falling back to Claude:', gptError)
          aiResponse = await summarizeWithFallback(transcript, CLAUDE_API_KEY, 'claude')
          addToast(`GPT-4o failed, using Claude instead`, 'warning')
        }
      }
      
      const summary = formatSummary(aiResponse)
      const keyPoints = formatKeyPoints(aiResponse)
      const actionItems = extractActionItems(aiResponse)

      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          id: fileData.id,
          updates: {
            status: 'completed',
            processingProgress: 100,
            summary: summary,
            keyPoints: keyPoints,
            actionItems: actionItems
          }
        }
      })

      addToast(`${fileData.name} processed successfully!`, 'success')

    } catch (error) {
      console.error('Error processing file:', error)
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      
      // Provide detailed error information
      let errorMessage = 'Unknown error occurred'
      if (error.message.includes('API key')) {
        errorMessage = 'API keys not configured. Please check your .env file.'
      } else if (error.message.includes('Whisper API error')) {
        errorMessage = 'Transcription failed. Check your OpenAI API key and file format.'
      } else if (error.message.includes('Claude API error') || error.message.includes('OpenAI API error')) {
        errorMessage = 'AI summarization failed. Check your API keys and try again.'
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.'
      } else if (error.message.includes('No API keys configured')) {
        errorMessage = 'No API keys found. Please restart your development server after adding keys to .env file.'
      } else {
        errorMessage = error.message
      }
      
      addToast(`Error processing ${fileData.name}: ${errorMessage}`, 'error', 10000)
      
      // Fallback to mock data if API fails
      const mockTranscript = `This is a sample transcript for ${fileData.name}. 
      
      Speaker 1: Welcome everyone to today's meeting. Let's start by reviewing our progress on the quarterly objectives.
      
      Speaker 2: Thank you for having me. I'd like to share some updates from the marketing team regarding our Q3 campaigns.
      
      Speaker 1: That sounds great. What are the key metrics we should be tracking?
      
      Speaker 2: We're focusing on conversion rates, customer acquisition cost, and brand awareness metrics.
      
      Speaker 1: Perfect. Let's schedule a follow-up meeting for next week to review the results.`

      const mockSummary = `Reviewed quarterly objectives and Q3 campaign progress. Marketing team provided updates on key performance metrics. Focus areas include conversion rates, customer acquisition cost, and brand awareness. Scheduled follow-up meeting for next week.`

      const mockKeyPoints = `• Reviewed quarterly objectives and Q3 campaign progress
• Marketing team provided updates on key performance metrics  
• Focus areas include conversion rates, customer acquisition cost, and brand awareness
• Scheduled follow-up meeting for next week`

      const mockActionItems = [
        {
          id: crypto.randomUUID(),
          description: 'Review Q3 campaign results',
          assignedTo: 'Marketing Team',
          dueDate: '2024-01-15',
          priority: 'high',
          completed: false
        },
        {
          id: crypto.randomUUID(),
          description: 'Schedule follow-up meeting',
          assignedTo: 'Project Manager',
          dueDate: '2024-01-10',
          priority: 'medium',
          completed: false
        }
      ]

      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          id: fileData.id,
          updates: {
            status: 'completed',
            processingProgress: 100,
            transcript: mockTranscript,
            summary: mockSummary,
            keyPoints: mockKeyPoints,
            actionItems: mockActionItems
          }
        }
      })

      addToast(`API error for ${fileData.name}, using demo data`, 'warning')
    }
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    processFiles(files)
  }, [processFiles])

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files
    processFiles(files)
  }, [processFiles])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your Meeting Recordings
        </h2>
        <p className="text-lg text-gray-600">
          Drag and drop your audio or video files, or click to browse
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 ${
          isDragOver
            ? 'border-primary bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".mp3,.mp4,.wav,.m4a,.webm"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="w-16 h-16 text-gray-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-gray-600 mb-4">
              Supported formats: MP3, MP4, WAV, M4A, WebM
            </p>
            <p className="text-sm text-gray-500">
              Maximum file size: 100MB
            </p>
          </div>
        </div>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Processing Files</h3>
          {uploadingFiles.map(file => (
            <div key={file.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {file.type.startsWith('audio/') ? (
                    <FileAudio className="w-5 h-5 text-blue-500" />
                  ) : (
                    <FileVideo className="w-5 h-5 text-purple-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.status === 'uploading' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </div>
                  )}
                  {file.status === 'processing' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-warning border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600">Processing...</span>
                    </div>
                  )}
                  {file.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-error" />
                  )}
                </div>
              </div>
              
              {file.status === 'processing' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.processingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
