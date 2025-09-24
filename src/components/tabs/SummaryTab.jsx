import React, { useState } from 'react'
import { 
  Download, 
  Copy, 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  Edit3,
  Save,
  X
} from 'lucide-react'
import { generatePDF } from '../../utils/pdfExport'
import { renderBoldText } from '../../utils/markdownRenderer.jsx'

export const SummaryTab = ({ file, dispatch, addToast }) => {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [tempNote, setTempNote] = useState(file.userNote || '')

  const handleNoteEdit = () => {
    setIsEditingNote(true)
    setTempNote(file.userNote || '')
  }

  const handleNoteSave = () => {
    dispatch({
      type: 'UPDATE_FILE',
      payload: {
        id: file.id,
        updates: { userNote: tempNote }
      }
    })
    setIsEditingNote(false)
    addToast('Note saved successfully', 'success')
  }

  const handleNoteCancel = () => {
    setTempNote(file.userNote || '')
    setIsEditingNote(false)
  }

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(file.summary)
      addToast('Summary copied to clipboard', 'success')
    } catch (err) {
      console.error('Failed to copy text: ', err)
      addToast('Failed to copy summary', 'error')
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
      {/* User Note Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Edit3 className="w-5 h-5" />
            <span>Your Notes</span>
          </h3>
          
          {!isEditingNote && (
            <button
              onClick={handleNoteEdit}
              className="text-primary hover:text-blue-700 transition-colors"
            >
              {file.userNote ? 'Edit' : 'Add Note'}
            </button>
          )}
        </div>

        {isEditingNote ? (
          <div className="space-y-3">
            <textarea
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Add your personal notes about this meeting..."
              className="input-field min-h-[100px] resize-none"
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleNoteSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleNoteCancel}
                className="btn-secondary flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-[100px] p-4 bg-gray-50 rounded-lg">
            {file.userNote ? (
              <p className="text-gray-900 whitespace-pre-wrap">{file.userNote}</p>
            ) : (
              <p className="text-gray-500 italic">No notes added yet. Click "Add Note" to add your personal notes about this meeting.</p>
            )}
          </div>
        )}
      </div>

      {/* Meeting Metadata */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium text-gray-900">
                {new Date(file.uploadedAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium text-gray-900">
                {file.duration || 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="font-medium text-gray-900">
                {file.participants || 'Not detected'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>AI-Generated Summary</span>
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="btn-secondary flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="prose max-w-none">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-gray-900 font-sans leading-relaxed">
              {file.summary ? (
                renderBoldText(file.summary)
              ) : (
                'Summary not available yet. Please wait for processing to complete.'
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
