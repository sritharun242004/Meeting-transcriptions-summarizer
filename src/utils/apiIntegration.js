// API Integration utilities for transcription and summarization
// This file contains example implementations for various APIs

// OpenAI Whisper API integration with language detection and translation
export const transcribeWithWhisper = async (audioFile, apiKey, options = {}) => {
  try {
    const formData = new FormData()
    formData.append('file', audioFile)
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'json')
    
    // Force English output for translation
    formData.append('language', 'en')
    
    // Add prompt to help with translation quality
    const translationPrompt = "This is a meeting recording. Please transcribe and translate the content to English, maintaining the original meaning and context. If the speakers are discussing business topics, meetings, or professional matters, ensure the translation is clear and professional."
    formData.append('prompt', translationPrompt)

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
  } catch (error) {
    console.error('Whisper transcription error:', error)
    throw error
  }
}

// Alternative function for auto-detection (without forcing English)
export const transcribeWithWhisperAuto = async (audioFile, apiKey) => {
  try {
    const formData = new FormData()
    formData.append('file', audioFile)
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'json')
    // Don't specify language - let Whisper auto-detect

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
  } catch (error) {
    console.error('Whisper transcription error:', error)
    throw error
  }
}

// Claude API integration for summarization
export const summarizeWithClaude = async (transcript, apiKey) => {
  try {
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
  } catch (error) {
    console.error('Claude summarization error:', error)
    throw error
  }
}

// Web Speech API integration (browser-native)
export const transcribeWithWebSpeech = (audioFile) => {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Web Speech API not supported in this browser'))
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    let transcript = ''

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + ' '
        }
      }
    }

    recognition.onend = () => {
      resolve(transcript.trim())
    }

    recognition.onerror = (event) => {
      reject(new Error(`Speech recognition error: ${event.error}`))
    }

    // Note: Web Speech API requires user interaction to start
    // This is a simplified example - in practice, you'd need to handle audio playback
    recognition.start()
  })
}

// OpenAI GPT-4o integration for advanced summarization
export const summarizeWithGPT4 = async (transcript, apiKey) => {
  try {
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
  } catch (error) {
    console.error('OpenAI GPT-4o summarization error:', error)
    throw error
  }
}

// OpenAI GPT-3.5 integration for summarization (fallback)
export const summarizeWithGPT = async (transcript, apiKey) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Please analyze this meeting transcript and provide a structured response with the following sections:

## Summary
Provide a concise executive summary (1 paragraph of 20-50 words) of the main topics discussed.

## Key Discussion Points
List the main discussion points in bullet format.

## Action Items
Extract any action items, tasks, or follow-ups mentioned. For each item, include:
- Task description
- Assigned person (if mentioned)
- Due date (if mentioned)
- Priority level (high/medium/low based on context)

Format action items as:
- [Task description] | Assigned to: [person] | Due: [date] | Priority: [level]

Transcript:
${transcript}`
        }],
        max_tokens: 1000,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const result = await response.json()
    return result.choices[0].message.content
  } catch (error) {
    console.error('OpenAI summarization error:', error)
    throw error
  }
}

// Utility function to extract action items from AI response
export const extractActionItems = (aiResponse) => {
  const actionItems = []
  const lines = aiResponse.split('\n')
  
  let inActionItemsSection = false
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Check if we're entering the action items section
    if (trimmedLine.toLowerCase().includes('## action items') || 
        trimmedLine.toLowerCase().includes('action items')) {
      inActionItemsSection = true
      continue
    }
    
    // Check if we're leaving the action items section
    if (inActionItemsSection && trimmedLine.startsWith('##') && 
        !trimmedLine.toLowerCase().includes('action items')) {
      break
    }
    
    // Process action item lines
    if (inActionItemsSection && (trimmedLine.startsWith('-') || trimmedLine.startsWith('•'))) {
      const itemText = trimmedLine.replace(/^[-•]\s*/, '')
      
      // Parse structured format: [description] | Assigned to: [person] | Due: [date] | Priority: [level]
      const parts = itemText.split('|').map(part => part.trim())
      
      let description = parts[0] || itemText
      let assignedTo = ''
      let dueDate = ''
      let priority = 'medium'
      
      // Extract details from structured format
      for (const part of parts) {
        if (part.toLowerCase().includes('assigned to:')) {
          assignedTo = part.replace(/assigned to:\s*/i, '').trim()
        } else if (part.toLowerCase().includes('due:')) {
          dueDate = part.replace(/due:\s*/i, '').trim()
        } else if (part.toLowerCase().includes('priority:')) {
          priority = part.replace(/priority:\s*/i, '').trim().toLowerCase()
        }
      }
      
      // Fallback: try to extract from unstructured text
      if (!assignedTo) {
        const assignedMatch = itemText.match(/(?:assigned to|assignee|responsible):\s*([^,|]+)/i)
        if (assignedMatch) assignedTo = assignedMatch[1].trim()
      }
      
      if (!dueDate) {
        const dueDateMatch = itemText.match(/(?:due|deadline|by):\s*([^,|]+)/i)
        if (dueDateMatch) dueDate = dueDateMatch[1].trim()
      }
      
      if (priority === 'medium') {
        const priorityMatch = itemText.match(/(?:priority|urgent|important):\s*([^,|]+)/i)
        if (priorityMatch) priority = priorityMatch[1].trim().toLowerCase()
      }
      
      // Clean up description (remove any trailing details)
      description = description.split(/[,;|]/)[0].trim()
      
      // Validate priority
      if (!['high', 'medium', 'low'].includes(priority)) {
        priority = 'medium'
      }
      
      actionItems.push({
        id: crypto.randomUUID(),
        description: description,
        assignedTo: assignedTo,
        dueDate: dueDate,
        priority: priority,
        completed: false
      })
    }
  }
  
  return actionItems
}

// Utility function to format AI response into separate sections
export const formatSummary = (aiResponse) => {
  const lines = aiResponse.split('\n')
  const summaryLines = []
  const keyPointsLines = []
  let inSummarySection = false
  let inKeyPointsSection = false
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Check for summary section
    if (trimmedLine.toLowerCase().includes('## summary') || 
        (trimmedLine.toLowerCase().includes('summary') && !inKeyPointsSection)) {
      inSummarySection = true
      inKeyPointsSection = false
      continue
    }
    
    // Check for key points section
    if (trimmedLine.toLowerCase().includes('## key discussion points') || 
        trimmedLine.toLowerCase().includes('key discussion points') ||
        trimmedLine.toLowerCase().includes('key points')) {
      inKeyPointsSection = true
      inSummarySection = false
      continue
    }
    
    // Check if we're leaving these sections
    if ((inSummarySection || inKeyPointsSection) && trimmedLine.startsWith('##') && 
        !trimmedLine.toLowerCase().includes('summary') && 
        !trimmedLine.toLowerCase().includes('key points')) {
      inSummarySection = false
      inKeyPointsSection = false
      break
    }
    
    // Collect summary content
    if (inSummarySection && trimmedLine && !trimmedLine.startsWith('##')) {
      summaryLines.push(trimmedLine)
    }
    
    // Collect key points content
    if (inKeyPointsSection && trimmedLine && !trimmedLine.startsWith('##')) {
      keyPointsLines.push(trimmedLine)
    }
  }
  
  // Return only the summary part (key points will be handled separately)
  if (summaryLines.length > 0) {
    return summaryLines.join('\n\n')
  }
  
  // If no structured sections found, return the full response
  return aiResponse
}

// Utility function to extract key discussion points
export const formatKeyPoints = (aiResponse) => {
  const lines = aiResponse.split('\n')
  const keyPointsLines = []
  let inKeyPointsSection = false
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Check for key points section
    if (trimmedLine.toLowerCase().includes('## key discussion points') || 
        trimmedLine.toLowerCase().includes('key discussion points') ||
        trimmedLine.toLowerCase().includes('key points')) {
      inKeyPointsSection = true
      continue
    }
    
    // Check if we're leaving the key points section
    if (inKeyPointsSection && trimmedLine.startsWith('##') && 
        !trimmedLine.toLowerCase().includes('key points')) {
      break
    }
    
    // Collect key points content
    if (inKeyPointsSection && trimmedLine && !trimmedLine.startsWith('##')) {
      keyPointsLines.push(trimmedLine)
    }
  }
  
  return keyPointsLines.join('\n')
}

// Environment variable helpers
export const getApiKey = (service) => {
  switch (service) {
    case 'openai':
      return import.meta.env.VITE_OPENAI_API_KEY?.trim()
    case 'claude':
      return import.meta.env.VITE_CLAUDE_API_KEY?.trim()
    default:
      return null
  }
}

// Check if API keys are available
export const checkApiKeys = () => {
  const openaiKey = getApiKey('openai')
  const claudeKey = getApiKey('claude')
  
  return {
    openai: !!openaiKey,
    claude: !!claudeKey,
    hasAny: !!(openaiKey || claudeKey)
  }
}

// Test API connectivity
export const testOpenAIConnection = async (apiKey) => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return {
      success: true,
      message: 'OpenAI API connection successful',
      models: data.data?.length || 0
    }
  } catch (error) {
    return {
      success: false,
      message: `OpenAI API connection failed: ${error.message}`,
      error: error.message
    }
  }
}

// Test Claude API connectivity
export const testClaudeConnection = async (apiKey) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
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
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return {
      success: true,
      message: 'Claude API connection successful',
      response: data.content?.[0]?.text || 'No response text'
    }
  } catch (error) {
    return {
      success: false,
      message: `Claude API connection failed: ${error.message}`,
      error: error.message
    }
  }
}

// Test all API connections
export const testAllConnections = async () => {
  const results = {
    openai: null,
    claude: null,
    summary: ''
  }
  
  const openaiKey = getApiKey('openai')
  const claudeKey = getApiKey('claude')
  
  if (openaiKey) {
    results.openai = await testOpenAIConnection(openaiKey)
  } else {
    results.openai = {
      success: false,
      message: 'OpenAI API key not configured'
    }
  }
  
  if (claudeKey) {
    results.claude = await testClaudeConnection(claudeKey)
  } else {
    results.claude = {
      success: false,
      message: 'Claude API key not configured'
    }
  }
  
  // Generate summary
  const workingApis = []
  if (results.openai?.success) workingApis.push('OpenAI')
  if (results.claude?.success) workingApis.push('Claude')
  
  if (workingApis.length === 0) {
    results.summary = '❌ No AI services are working. Please check your API keys.'
  } else if (workingApis.length === 2) {
    results.summary = '✅ All AI services are working correctly!'
  } else {
    results.summary = `⚠️ Only ${workingApis.join(' and ')} is working.`
  }
  
  return results
}
