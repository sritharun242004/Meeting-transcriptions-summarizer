import React from 'react'
import { 
  Copy, 
  Download,
  List
} from 'lucide-react'
import { generatePDF } from '../../utils/pdfExport'
import { renderMarkdownText } from '../../utils/markdownRenderer.jsx'

export const KeyPointsTab = ({ file, dispatch, addToast }) => {
  const handleCopyKeyPoints = async () => {
    try {
      await navigator.clipboard.writeText(file.keyPoints)
      addToast('Key points copied to clipboard', 'success')
    } catch (err) {
      console.error('Failed to copy text: ', err)
      addToast('Failed to copy key points', 'error')
    }
  }

  const handleExportPDF = () => {
    try {
      generatePDF(file)
      addToast('PDF exported successfully', 'success')
    } catch (error) {
      console.error('PDF export error:', error)
      addToast('Failed to export PDF', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <List className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-gray-900">Key Discussion Points</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyKeyPoints}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Key Points Content */}
      <div className="card">
        {file.keyPoints ? (
          <div className="prose prose-gray max-w-none">
            <div className="text-gray-800 leading-relaxed">
              {renderMarkdownText(file.keyPoints, true)}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <List className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No key points available</p>
            <p className="text-sm text-gray-400 mt-2">
              Key discussion points will appear here after processing
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
