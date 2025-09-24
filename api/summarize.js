// Vercel Serverless Function for AI Summarization
// This keeps your API keys secure on the server side

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
    const { transcript, provider = 'openai', model = 'gpt-4o' } = req.body

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' })
    }

    let result

    if (provider === 'claude') {
      result = await summarizeWithClaude(transcript)
    } else {
      result = await summarizeWithOpenAI(transcript, model)
    }

    res.status(200).json({ summary: result })

  } catch (error) {
    console.error('Summarization error:', error)
    res.status(500).json({ 
      error: 'Summarization failed', 
      message: error.message 
    })
  }
}

async function summarizeWithOpenAI(transcript, model) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
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
    const errorData = await response.text()
    throw new Error(`OpenAI API error: ${response.status} ${errorData}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function summarizeWithClaude(transcript) {
  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey) {
    throw new Error('Claude API key not configured')
  }

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
    const errorData = await response.text()
    throw new Error(`Claude API error: ${response.status} ${errorData}`)
  }

  const data = await response.json()
  return data.content[0].text
}
