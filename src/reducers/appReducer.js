export const initialState = {
  files: [],
  activeFileId: null,
  activeTab: 'summary',
  settings: {
    theme: 'light',
    autoProcess: true
  }
}

export const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FILES':
      return {
        ...state,
        files: [...state.files, ...action.payload]
      }
    
    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map(file => 
          file.id === action.payload.id 
            ? { ...file, ...action.payload.updates }
            : file
        )
      }
    
    case 'SET_ACTIVE_FILE':
      return {
        ...state,
        activeFileId: action.payload
      }
    
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload
      }
    
    case 'CLEAR_FILES':
      return {
        ...state,
        files: [],
        activeFileId: null
      }
    
    case 'REMOVE_FILE':
      return {
        ...state,
        files: state.files.filter(file => file.id !== action.payload),
        activeFileId: state.activeFileId === action.payload ? null : state.activeFileId
      }
    
    default:
      return state
  }
}

