import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Copy, 
  Download, 
  Filter,
  Clock,
  User
} from 'lucide-react'

export const TranscriptTab = ({ file, dispatch, addToast }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showTimestamps, setShowTimestamps] = useState(true)
  const [showSpeakerLabels, setShowSpeakerLabels] = useState(true)

  const filteredTranscript = useMemo(() => {
    if (!searchTerm) return file.transcript
    
    const lines = file.transcript.split('\n')
    return lines
      .filter(line => 
        line.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .join('\n')
  }, [file.transcript, searchTerm])

  const handleCopyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(file.transcript)
      addToast('Transcript copied to clipboard', 'success')
    } catch (err) {
      console.error('Failed to copy text: ', err)
      addToast('Failed to copy transcript', 'error')
    }
  }

  const handleDownloadTranscript = () => {
    try {
      const blob = new Blob([file.transcript], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file.name.replace(/\.[^/.]+$/, '')}_transcript.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      addToast('Transcript downloaded successfully', 'success')
    } catch (error) {
      console.error('Download error:', error)
      addToast('Failed to download transcript', 'error')
    }
  }

  const formatTranscript = (transcript) => {
    if (!transcript) return 'Transcript not available yet. Please wait for processing to complete.'
    
    const lines = transcript.split('\n')
    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />
      
      // Check if line contains speaker label (e.g., "Speaker 1:")
      const speakerMatch = line.match(/^(Speaker \d+):\s*(.*)$/)
      if (speakerMatch && showSpeakerLabels) {
        return (
          <div key={index} className="mb-3">
            <div className="flex items-center space-x-2 mb-1">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary">{speakerMatch[1]}</span>
            </div>
            <p className="text-gray-900 ml-6">{speakerMatch[2]}</p>
          </div>
        )
      }
      
      // Regular text line
      return (
        <p key={index} className="text-gray-900 mb-2 leading-relaxed">
          {line}
        </p>
      )
    })
  }

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transcript..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Display Options */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showTimestamps}
                onChange={(e) => setShowTimestamps(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Show timestamps</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showSpeakerLabels}
                onChange={(e) => setShowSpeakerLabels(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Show speakers</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyTranscript}
              className="btn-secondary flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={handleDownloadTranscript}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {searchTerm && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Found {filteredTranscript.split('\n').filter(line => 
                line.toLowerCase().includes(searchTerm.toLowerCase())
              ).length} result{filteredTranscript.split('\n').filter(line => 
                line.toLowerCase().includes(searchTerm.toLowerCase())
              ).length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Transcript Content */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Full Transcript</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              {file.transcript ? 
                `${file.transcript.split(' ').length} words` : 
                'Processing...'
              }
            </span>
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-6">
              {searchTerm ? (
                <div className="space-y-2">
                  {filteredTranscript.split('\n').map((line, index) => (
                    <p key={index} className="text-gray-900 leading-relaxed">
                      {highlightSearchTerm(line)}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {formatTranscript(file.transcript)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Stats */}
      {file.transcript && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {file.transcript.split(' ').length}
              </p>
              <p className="text-sm text-gray-600">Total Words</p>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {file.transcript.split('\n').filter(line => line.trim()).length}
              </p>
              <p className="text-sm text-gray-600">Lines</p>
            </div>
          </div>
          
          <div className="card">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.ceil(file.transcript.split(' ').length / 200)}
              </p>
              <p className="text-sm text-gray-600">Reading Time (min)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
