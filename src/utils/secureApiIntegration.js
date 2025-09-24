// Secure API Integration utilities for production deployment
// This version uses Vercel serverless functions to keep API keys secure

// Convert audio file to base64 for secure transmission
export const audioToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1] // Remove data:audio/...;base64, prefix
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Secure transcription using Vercel serverless function
export const transcribeWithSecureAPI = async (audioFile, options = {}) => {
  try {
    const audioData = await audioToBase64(audioFile)
    
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audioData,
        options: {
          language: options.language || 'en',
          prompt: options.prompt || "This is a meeting recording. Please transcribe the content clearly, maintaining the original meaning and context."
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `API error: ${response.statusText}`)
    }

    const result = await response.json()
    return result.text
  } catch (error) {
    console.error('Secure transcription error:', error)
    throw error
  }
}

// Secure summarization using Vercel serverless function
export const summarizeWithSecureAPI = async (transcript, provider = 'openai', model = 'gpt-4o') => {
  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transcript,
        provider,
        model
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `API error: ${response.statusText}`)
    }

    const result = await response.json()
    return result.summary
  } catch (error) {
    console.error('Secure summarization error:', error)
    throw error
  }
}

// Fallback to direct API calls if serverless functions are not available
export const transcribeWithFallback = async (audioFile, apiKey, options = {}) => {
  try {
    // Try secure API first
    return await transcribeWithSecureAPI(audioFile, options)
  } catch (error) {
    console.warn('Secure API failed, falling back to direct API call:', error.message)
    
    // Fallback to direct API call (exposes API key)
    const formData = new FormData()
    formData.append('file', audioFile)
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'json')
    
    if (options.language) {
      formData.append('language', options.language)
    }
    
    if (options.prompt) {
      formData.append('prompt', options.prompt)
    }

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`)
    }

    const result = await response.json()
    return result.text
  }
}

// Fallback summarization
export const summarizeWithFallback = async (transcript, apiKey, provider = 'openai') => {
  try {
    // Try secure API first
    return await summarizeWithSecureAPI(transcript, provider)
  } catch (error) {
    console.warn('Secure API failed, falling back to direct API call:', error.message)
    
    // Fallback to direct API call
    if (provider === 'claude') {
      return await summarizeWithClaudeDirect(transcript, apiKey)
    } else {
      return await summarizeWithOpenAIDirect(transcript, apiKey)
    }
  }
}

// Direct Claude API call (fallback)
const summarizeWithClaudeDirect = async (transcript, apiKey) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Please analyze this meeting transcript and provide a structured response with the following sections:

## Summary
Provide a concise executive summary (1 paragraph within 20-50 words) of the main topics discussed, decisions made, and outcomes.

## Key Discussion Points
List the main discussion points in bullet format, highlighting important decisions and insights.

## Action Items
Extract any action items, tasks, or follow-ups mentioned. For each item, include:
- Task description
- Assigned person (if mentioned)
- Due date (if mentioned)
- Priority level (high/medium/low based on context)

Format action items as:
- [Task description] | Assigned to: [person] | Due: [date] | Priority: [level]

## Meeting Insights
Provide additional insights about:
- Meeting effectiveness and participation
- Key concerns or risks mentioned
- Opportunities identified
- Next steps or follow-up meetings

Transcript:
${transcript}`
      }]
    })
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`)
  }

  const result = await response.json()
  return result.content[0].text
}

// Direct OpenAI API call (fallback)
const summarizeWithOpenAIDirect = async (transcript, apiKey) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Please analyze this meeting transcript and provide a comprehensive structured response with the following sections:

## Summary
Provide a detailed executive summary (1 paragraph of 20-50 words) of the main topics discussed, key decisions made, outcomes, and important insights. Focus on business impact and strategic implications.

## Key Discussion Points
List the main discussion points in bullet format, highlighting:
- Important decisions and their rationale
- Key insights and discoveries
- Strategic discussions and planning
- Technical or operational details

## Action Items
Extract any action items, tasks, or follow-ups mentioned. For each item, include:
- Clear task description
- Assigned person or team (if mentioned)
- Due date or timeline (if mentioned)
- Priority level (high/medium/low based on context and urgency)
- Dependencies or related tasks

Format action items as:
- [Task description] | Assigned to: [person] | Due: [date] | Priority: [level]

## Meeting Insights
Provide additional insights about:
- Meeting effectiveness and participation
- Key concerns or risks mentioned
- Opportunities identified
- Next steps or follow-up meetings

Transcript:
${transcript}`
      }],
      max_tokens: 2000,
      temperature: 0.2
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const result = await response.json()
  return result.choices[0].message.content
}

// Check if secure API is available
export const checkSecureAPI = async () => {
  try {
    const response = await fetch('/api/transcribe', {
      method: 'OPTIONS'
    })
    return response.ok
  } catch (error) {
    return false
  }
}

// Environment detection
export const isProduction = () => {
  return import.meta.env.PROD
}

// Get API configuration based on environment
export const getAPIConfig = () => {
  const isSecure = isProduction() // Use secure API in production
  
  return {
    useSecureAPI: isSecure,
    fallbackToDirect: !isSecure, // Allow direct API calls in development
    hasSecureAPI: false // Will be set by checkSecureAPI
  }
}
