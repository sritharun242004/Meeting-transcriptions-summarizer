// Utility functions for rendering markdown-like formatting in React components

/**
 * Renders text with basic markdown formatting (bold, bullet points)
 * @param {string} text - The text to render
 * @param {boolean} showBullets - Whether to render bullet points with visual indicators
 * @returns {JSX.Element} - Rendered text with formatting
 */
export const renderMarkdownText = (text, showBullets = false) => {
  if (!text) return null

  return text.split('\n').map((line, index) => {
    const trimmedLine = line.trim()
    
    // Handle bullet points
    if (showBullets && (trimmedLine.startsWith('•') || trimmedLine.startsWith('-'))) {
      const cleanLine = trimmedLine.replace(/^[•-]\s*/, '')
      return (
        <div key={index} className="flex items-start space-x-3 mb-2">
          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
          <div className="flex-1">
            {renderBoldText(cleanLine)}
          </div>
        </div>
      )
    } else if (trimmedLine) {
      return (
        <div key={index} className="mb-2">
          {renderBoldText(trimmedLine)}
        </div>
      )
    }
    return null
  })
}

/**
 * Renders text with bold formatting (**text**)
 * @param {string} text - The text to render
 * @returns {JSX.Element} - Rendered text with bold formatting
 */
export const renderBoldText = (text) => {
  if (!text) return null

  return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={index}>{part}</span>
  })
}

/**
 * Renders a simple paragraph with bold formatting
 * @param {string} text - The text to render
 * @returns {JSX.Element} - Rendered paragraph
 */
export const renderParagraph = (text) => {
  if (!text) return null

  return (
    <p className="text-gray-900 leading-relaxed">
      {renderBoldText(text)}
    </p>
  )
}
