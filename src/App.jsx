import React, { useState, useReducer } from 'react'
import { FileUpload } from './components/FileUpload'
import { Dashboard } from './components/Dashboard'
import { DetailedView } from './components/DetailedView'
import { Header } from './components/Header'
import { ToastContainer } from './components/Toast'
import { appReducer, initialState } from './reducers/appReducer'

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header addToast={addToast} />
      <main className="container mx-auto px-4 py-8">
        {state.files.length === 0 ? (
          <FileUpload dispatch={dispatch} addToast={addToast} />
        ) : state.activeFileId ? (
          <DetailedView 
            state={state} 
            dispatch={dispatch}
            addToast={addToast}
          />
        ) : (
          <Dashboard 
            state={state} 
            dispatch={dispatch}
            addToast={addToast}
          />
        )}
      </main>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default App
