# Meeting Transcription & Summarization Web Application

A comprehensive client-side web application that processes audio/video meeting recordings and generates transcripts, summaries, and action items. Built with React and designed to work entirely in the browser without requiring any backend infrastructure.

## Features

### 🎯 Core Functionality
- **File Upload**: Drag-and-drop interface supporting MP3, MP4, WAV, M4A, WebM formats
- **Transcription**: Audio/video to text conversion (ready for API integration)
- **AI Summarization**: Intelligent meeting summaries and key points extraction
- **Action Items**: Automatic extraction and management of tasks and follow-ups
- **Export Options**: PDF reports and text file downloads

### 📱 User Interface
- **Modern Design**: Clean, minimalist interface with Tailwind CSS
- **Responsive Layout**: Mobile-friendly design that works on all devices
- **Three-Tab View**: Summary, Transcript, and Action Items in organized tabs
- **Real-time Status**: Live processing indicators and progress tracking
- **Interactive Elements**: Clickable file cards, searchable transcripts, and editable notes

### 🔧 Technical Features
- **Client-Side Processing**: No backend required - everything runs in the browser
- **State Management**: React hooks for efficient state handling
- **File Validation**: Size and format checking with user feedback
- **Export Capabilities**: Professional PDF generation with jsPDF
- **Search & Filter**: Find content quickly with built-in search functionality

## Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd "D:\Private\Cursor Ai project"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Project Structure

```
src/
├── components/
│   ├── Header.jsx              # Application header
│   ├── FileUpload.jsx          # Drag-and-drop file upload
│   ├── Dashboard.jsx           # Main file management view
│   ├── DetailedView.jsx        # Three-tab detailed view
│   └── tabs/
│       ├── SummaryTab.jsx      # AI summary and notes
│       ├── TranscriptTab.jsx   # Full transcript with search
│       └── ActionItemsTab.jsx  # Task management
├── reducers/
│   └── appReducer.js           # State management
├── utils/
│   └── pdfExport.js            # PDF generation utilities
├── App.jsx                     # Main application component
├── main.jsx                    # Application entry point
└── index.css                   # Global styles and Tailwind
```

## API Integration

The application is designed to integrate with external APIs for transcription and summarization. Currently includes mock data for demonstration purposes.

### Transcription APIs
- **Web Speech API**: Browser-native speech recognition
- **OpenAI Whisper API**: High-quality transcription service
- **Custom Integration**: Easy to add other transcription services

### Summarization APIs
- **Claude API**: Advanced AI summarization and action item extraction
- **OpenAI GPT**: Alternative summarization service
- **Custom Models**: Flexible integration for other AI services

### Adding API Keys
Create a `.env` file in the project root:
```env
VITE_OPENAI_API_KEY=your_openai_key_here
VITE_CLAUDE_API_KEY=your_claude_key_here
```

## Usage Guide

### 1. Upload Files
- Drag and drop audio/video files onto the upload area
- Or click to browse and select files
- Supported formats: MP3, MP4, WAV, M4A, WebM
- Maximum file size: 100MB per file

### 2. Monitor Processing
- View upload progress in real-time
- Track transcription and AI processing status
- See completion indicators for each file

### 3. Review Results
- Click on any completed file to view details
- Navigate between Summary, Transcript, and Action Items tabs
- Add personal notes and edit action items

### 4. Export Content
- Generate professional PDF reports
- Download transcripts as text files
- Export action items separately (completed/pending)

## Customization

### Styling
The application uses Tailwind CSS with a custom color scheme:
- Primary: Blue-600 (#2563EB)
- Secondary: Gray-700 (#374151)
- Success: Green-500 (#10B981)
- Warning: Yellow-500 (#F59E0B)
- Error: Red-500 (#EF4444)

### Adding Features
- **New File Types**: Update `SUPPORTED_FORMATS` in `FileUpload.jsx`
- **Custom Processing**: Modify the `processFile` function
- **Additional Export Formats**: Extend the `pdfExport.js` utilities
- **UI Components**: Add new components in the `components/` directory

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Responsive design works on all modern mobile browsers

## Performance Considerations

- **File Size Limits**: 100MB per file for optimal browser performance
- **Memory Management**: Large files are processed in chunks
- **Lazy Loading**: Transcripts are loaded on-demand
- **Efficient Rendering**: React optimizations for smooth user experience

## Troubleshooting

### Common Issues

1. **Files not uploading**
   - Check file format is supported
   - Verify file size is under 100MB
   - Ensure browser supports FileReader API

2. **Processing stuck**
   - Refresh the page and try again
   - Check browser console for errors
   - Verify API keys are correctly set

3. **Export not working**
   - Ensure jsPDF library is properly installed
   - Check browser allows file downloads
   - Verify sufficient disk space

### Getting Help
- Check the browser console for error messages
- Verify all dependencies are installed correctly
- Ensure you're using a supported browser version

## Future Enhancements

- **Real-time Transcription**: Live meeting transcription
- **Multi-language Support**: International language processing
- **Meeting Analytics**: Talk time distribution and sentiment analysis
- **Calendar Integration**: Automatic meeting context
- **Collaboration Features**: Share and collaborate on transcripts
- **Advanced Search**: Semantic search across all meetings
- **Voice Commands**: Hands-free navigation and control

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests to improve the application.

