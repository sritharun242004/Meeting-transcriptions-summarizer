import React from 'react'
import { ArrowLeft, FileText, List, CheckSquare, Target } from 'lucide-react'
import { SummaryTab } from './tabs/SummaryTab'
import { TranscriptTab } from './tabs/TranscriptTab'
import { ActionItemsTab } from './tabs/ActionItemsTab'
import { KeyPointsTab } from './tabs/KeyPointsTab'

export const DetailedView = ({ state, dispatch, addToast }) => {
  const activeFile = state.files.find(file => file.id === state.activeFileId)

  if (!activeFile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">File not found</p>
        <button
          onClick={() => dispatch({ type: 'SET_ACTIVE_FILE', payload: null })}
          className="btn-primary mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'keypoints', label: 'Key Points', icon: Target },
    { id: 'transcript', label: 'Transcript', icon: List },
    { id: 'actions', label: 'Action Items', icon: CheckSquare }
  ]

  const handleBackToDashboard = () => {
    dispatch({ type: 'SET_ACTIVE_FILE', payload: null })
  }

  const handleTabChange = (tabId) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId })
  }

  const renderTabContent = () => {
    switch (state.activeTab) {
      case 'summary':
        return <SummaryTab file={activeFile} dispatch={dispatch} addToast={addToast} />
      case 'keypoints':
        return <KeyPointsTab file={activeFile} dispatch={dispatch} addToast={addToast} />
      case 'transcript':
        return <TranscriptTab file={activeFile} dispatch={dispatch} addToast={addToast} />
      case 'actions':
        return <ActionItemsTab file={activeFile} dispatch={dispatch} addToast={addToast} />
      default:
        return <SummaryTab file={activeFile} dispatch={dispatch} addToast={addToast} />
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {activeFile.name}
            </h2>
            <p className="text-sm text-gray-500">
              Uploaded {new Date(activeFile.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = state.activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>
    </div>
  )
}
