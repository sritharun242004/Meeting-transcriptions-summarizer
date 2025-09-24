import React from 'react'
import { 
  FileAudio, 
  FileVideo, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Trash2,
  Plus,
  Calendar,
  HardDrive
} from 'lucide-react'

export const Dashboard = ({ state, dispatch, addToast }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error" />
      case 'processing':
        return <div className="w-5 h-5 border-2 border-warning border-t-transparent rounded-full animate-spin"></div>
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Ready'
      case 'error':
        return 'Error'
      case 'processing':
        return 'Processing'
      default:
        return 'Uploading'
    }
  }

  const handleFileClick = (fileId) => {
    dispatch({ type: 'SET_ACTIVE_FILE', payload: fileId })
  }

  const handleRemoveFile = (fileId, e) => {
    e.stopPropagation()
    const file = state.files.find(f => f.id === fileId)
    dispatch({ type: 'REMOVE_FILE', payload: fileId })
    addToast(`Removed ${file?.name || 'file'}`, 'info')
  }

  const handleAddMoreFiles = () => {
    dispatch({ type: 'CLEAR_FILES' })
  }

  const completedFiles = state.files.filter(file => file.status === 'completed')
  const processingFiles = state.files.filter(file => file.status === 'processing' || file.status === 'uploading')
  const errorFiles = state.files.filter(file => file.status === 'error')

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Meetings</h2>
          <p className="text-gray-600">
            {state.files.length} file{state.files.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAddMoreFiles}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add More Files</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileAudio className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <p className="text-xl font-semibold text-gray-900">{state.files.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-semibold text-gray-900">{completedFiles.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-xl font-semibold text-gray-900">{processingFiles.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-xl font-semibold text-gray-900">{errorFiles.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.files.map(file => (
          <div
            key={file.id}
            onClick={() => file.status === 'completed' && handleFileClick(file.id)}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
              file.status === 'completed' 
                ? 'hover:border-primary' 
                : 'cursor-default opacity-75'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {file.type.startsWith('audio/') ? (
                  <FileAudio className="w-8 h-8 text-blue-500" />
                ) : (
                  <FileVideo className="w-8 h-8 text-purple-500" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {file.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => handleRemoveFile(file.id, e)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(file.status)}
                  <span className="text-sm font-medium text-gray-900">
                    {getStatusText(file.status)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uploaded</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {formatDate(file.uploadedAt)}
                  </span>
                </div>
              </div>

              {file.status === 'processing' && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs text-gray-600">
                      {file.processingProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${file.processingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {file.status === 'completed' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Click to view details</span>
                    <HardDrive className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {state.files.length === 0 && (
        <div className="text-center py-12">
          <FileAudio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No files uploaded yet
          </h3>
          <p className="text-gray-600 mb-4">
            Upload your first meeting recording to get started
          </p>
          <button
            onClick={handleAddMoreFiles}
            className="btn-primary"
          >
            Upload Files
          </button>
        </div>
      )}
    </div>
  )
}
