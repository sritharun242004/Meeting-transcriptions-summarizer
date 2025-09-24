import React, { useState } from 'react'
import { 
  CheckSquare, 
  Square, 
  Download, 
  Filter,
  Calendar,
  User,
  AlertCircle,
  Clock,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react'
import { generateActionItemsPDF } from '../../utils/pdfExport'

export const ActionItemsTab = ({ file, dispatch, addToast }) => {
  const [filter, setFilter] = useState('all') // all, completed, pending
  const [priorityFilter, setPriorityFilter] = useState('all') // all, high, medium, low
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState({
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium'
  })

  const filteredActionItems = file.actionItems?.filter(item => {
    const statusMatch = filter === 'all' || 
      (filter === 'completed' && item.completed) ||
      (filter === 'pending' && !item.completed)
    
    const priorityMatch = priorityFilter === 'all' || item.priority === priorityFilter
    
    return statusMatch && priorityMatch
  }) || []

  const handleToggleComplete = (itemId) => {
    const updatedItems = file.actionItems.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    )
    
    dispatch({
      type: 'UPDATE_FILE',
      payload: {
        id: file.id,
        updates: { actionItems: updatedItems }
      }
    })
  }

  const handleAddItem = () => {
    if (!newItem.description.trim()) return

    const item = {
      id: crypto.randomUUID(),
      description: newItem.description,
      assignedTo: newItem.assignedTo,
      dueDate: newItem.dueDate,
      priority: newItem.priority,
      completed: false
    }

    const updatedItems = [...(file.actionItems || []), item]
    
    dispatch({
      type: 'UPDATE_FILE',
      payload: {
        id: file.id,
        updates: { actionItems: updatedItems }
      }
    })

    setNewItem({
      description: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium'
    })
    setIsAddingItem(false)
    addToast('Action item added successfully', 'success')
  }

  const handleDeleteItem = (itemId) => {
    const updatedItems = file.actionItems.filter(item => item.id !== itemId)
    
    dispatch({
      type: 'UPDATE_FILE',
      payload: {
        id: file.id,
        updates: { actionItems: updatedItems }
      }
    })
    addToast('Action item deleted', 'info')
  }

  const handleExportItems = (completedOnly = false) => {
    try {
      // Export as PDF
      generateActionItemsPDF(file, completedOnly)
      
      // Also export as text file
      const itemsToExport = completedOnly 
        ? file.actionItems.filter(item => item.completed)
        : file.actionItems.filter(item => !item.completed)
      
      const exportText = itemsToExport.map(item => 
        `- [${item.completed ? 'x' : ' '}] ${item.description}
  Assigned to: ${item.assignedTo || 'Not specified'}
  Due date: ${item.dueDate || 'Not specified'}
  Priority: ${item.priority}
`
      ).join('\n')

      const blob = new Blob([exportText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file.name.replace(/\.[^/.]+$/, '')}_${completedOnly ? 'completed' : 'pending'}_actions.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      addToast(`${completedOnly ? 'Completed' : 'Pending'} action items exported successfully`, 'success')
    } catch (error) {
      console.error('Export error:', error)
      addToast('Failed to export action items', 'error')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />
      case 'medium':
        return <Clock className="w-4 h-4" />
      case 'low':
        return <CheckSquare className="w-4 h-4" />
      default:
        return <Square className="w-4 h-4" />
    }
  }

  const completedCount = file.actionItems?.filter(item => item.completed).length || 0
  const totalCount = file.actionItems?.length || 0

  return (
    <div className="space-y-6">
      {/* Stats and Controls */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalCount}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{completedCount}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{totalCount - completedCount}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Items</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExportItems(false)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Pending</span>
            </button>
            <button
              onClick={() => handleExportItems(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Completed</span>
            </button>
            <button
              onClick={() => setIsAddingItem(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add New Item Form */}
      {isAddingItem && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Action Item</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Describe the action item..."
                className="input-field min-h-[80px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To
                </label>
                <input
                  type="text"
                  value={newItem.assignedTo}
                  onChange={(e) => setNewItem({ ...newItem, assignedTo: e.target.value })}
                  placeholder="Person or team"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newItem.priority}
                  onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddItem}
                className="btn-primary"
                disabled={!newItem.description.trim()}
              >
                Add Item
              </button>
              <button
                onClick={() => setIsAddingItem(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Items List */}
      <div className="space-y-4">
        {filteredActionItems.length === 0 ? (
          <div className="card text-center py-12">
            <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {file.actionItems?.length === 0 ? 'No action items found' : 'No items match your filters'}
            </h3>
            <p className="text-gray-600 mb-4">
              {file.actionItems?.length === 0 
                ? 'Action items will appear here once the meeting is processed.'
                : 'Try adjusting your filters to see more items.'
              }
            </p>
            {file.actionItems?.length === 0 && (
              <button
                onClick={() => setIsAddingItem(true)}
                className="btn-primary"
              >
                Add First Item
              </button>
            )}
          </div>
        ) : (
          filteredActionItems.map(item => (
            <div
              key={item.id}
              className={`card transition-all duration-200 ${
                item.completed ? 'opacity-75 bg-gray-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => handleToggleComplete(item.id)}
                  className="mt-1 text-primary hover:text-blue-700 transition-colors"
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${
                    item.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                    {item.assignedTo && (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{item.assignedTo}</span>
                      </div>
                    )}

                    {item.dueDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {getPriorityIcon(item.priority)}
                      <span className="capitalize">{item.priority}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
