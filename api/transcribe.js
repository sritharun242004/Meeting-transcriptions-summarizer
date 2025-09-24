// Vercel Serverless Function for OpenAI Whisper API
// This keeps your API key secure on the server side

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { audioData, options = {} } = req.body

    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' })
    }

    // Convert base64 audio data to buffer
    const audioBuffer = Buffer.from(audioData, 'base64')
    
    // Create form data for OpenAI API
    const formData = new FormData()
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' })
    formData.append('file', blob, 'audio.mp3')
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'json')
    
    if (options.language) {
      formData.append('language', options.language)
    }
    
    if (options.prompt) {
      formData.append('prompt', options.prompt)
    }

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`)
    }

    const result = await response.json()
    res.status(200).json({ text: result.text })

  } catch (error) {
    console.error('Transcription error:', error)
    res.status(500).json({ 
      error: 'Transcription failed', 
      message: error.message 
    })
  }
}
