import React, { useState } from 'react'
import { Mic, FileText, Settings } from 'lucide-react'
import { Settings as SettingsModal } from './Settings'

export const Header = ({ addToast }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Meeting Transcription
                </h1>
                <p className="text-sm text-gray-500">
                  Upload, transcribe, and summarize your meetings
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="w-4 h-4" />
                <span>AI-Powered Analysis</span>
              </div>
              
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        addToast={addToast}
      />
    </>
  )
}
