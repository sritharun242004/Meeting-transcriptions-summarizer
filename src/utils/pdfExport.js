import jsPDF from 'jspdf'

export const generatePDF = (file) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPosition = margin

  // Helper function to add text with word wrapping
  const addWrappedText = (text, x, y, maxWidth, fontSize = 12, fontStyle = 'normal') => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', fontStyle)
    
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * fontSize * 0.4) + 5
  }

  // Helper function to add a new page if needed
  const checkNewPage = (requiredSpace) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Header
  doc.setFillColor(37, 99, 235) // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Meeting Transcription Report', margin, 25)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 35)
  
  yPosition = 50

  // Meeting Information
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Meeting Information', margin, yPosition)
  yPosition += 15

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  const meetingInfo = [
    `File Name: ${file.name}`,
    `Upload Date: ${new Date(file.uploadedAt).toLocaleDateString()}`,
    `File Size: ${(file.size / 1024 / 1024).toFixed(1)} MB`,
    `Duration: ${file.duration || 'Unknown'}`,
    `Participants: ${file.participants || 'Not detected'}`
  ]

  meetingInfo.forEach(info => {
    yPosition = addWrappedText(info, margin, yPosition, contentWidth, 12)
  })

  yPosition += 10

  // User Notes
  if (file.userNote) {
    checkNewPage(30)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Your Notes', margin, yPosition)
    yPosition += 15

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    yPosition = addWrappedText(file.userNote, margin, yPosition, contentWidth, 12)
    yPosition += 10
  }

  // AI Summary
  if (file.summary) {
    checkNewPage(50)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('AI-Generated Summary', margin, yPosition)
    yPosition += 15

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    yPosition = addWrappedText(file.summary, margin, yPosition, contentWidth, 12)
    yPosition += 15
  }

  // Action Items
  if (file.actionItems && file.actionItems.length > 0) {
    checkNewPage(50)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Action Items', margin, yPosition)
    yPosition += 15

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    const completedItems = file.actionItems.filter(item => item.completed)
    const pendingItems = file.actionItems.filter(item => !item.completed)

    if (pendingItems.length > 0) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Pending Items', margin, yPosition)
      yPosition += 10

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')

      pendingItems.forEach((item, index) => {
        checkNewPage(30)
        const itemText = `${index + 1}. ${item.description}`
        yPosition = addWrappedText(itemText, margin, yPosition, contentWidth, 12)
        
        const details = []
        if (item.assignedTo) details.push(`Assigned to: ${item.assignedTo}`)
        if (item.dueDate) details.push(`Due: ${new Date(item.dueDate).toLocaleDateString()}`)
        details.push(`Priority: ${item.priority}`)
        
        if (details.length > 0) {
          yPosition = addWrappedText(details.join(' | '), margin + 10, yPosition, contentWidth - 10, 10)
        }
        yPosition += 5
      })
    }

    if (completedItems.length > 0) {
      yPosition += 10
      checkNewPage(30)
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Completed Items', margin, yPosition)
      yPosition += 10

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')

      completedItems.forEach((item, index) => {
        checkNewPage(30)
        const itemText = `✓ ${item.description}`
        yPosition = addWrappedText(itemText, margin, yPosition, contentWidth, 12)
        
        const details = []
        if (item.assignedTo) details.push(`Assigned to: ${item.assignedTo}`)
        if (item.dueDate) details.push(`Due: ${new Date(item.dueDate).toLocaleDateString()}`)
        details.push(`Priority: ${item.priority}`)
        
        if (details.length > 0) {
          yPosition = addWrappedText(details.join(' | '), margin + 10, yPosition, contentWidth - 10, 10)
        }
        yPosition += 5
      })
    }
  }

  // Full Transcript
  if (file.transcript) {
    checkNewPage(50)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Full Transcript', margin, yPosition)
    yPosition += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    // Split transcript into chunks to fit pages
    const transcriptLines = file.transcript.split('\n')
    let currentChunk = ''
    
    transcriptLines.forEach(line => {
      const testChunk = currentChunk + line + '\n'
      const testHeight = doc.getTextDimensions(testChunk).h
      
      if (yPosition + testHeight > pageHeight - margin) {
        // Add current chunk and start new page
        if (currentChunk) {
          yPosition = addWrappedText(currentChunk, margin, yPosition, contentWidth, 10)
        }
        doc.addPage()
        yPosition = margin
        currentChunk = line + '\n'
      } else {
        currentChunk = testChunk
      }
    })
    
    // Add remaining chunk
    if (currentChunk) {
      yPosition = addWrappedText(currentChunk, margin, yPosition, contentWidth, 10)
    }
  }

  // Footer on each page
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(128, 128, 128)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10)
  }

  // Save the PDF
  const fileName = `${file.name.replace(/\.[^/.]+$/, '')}_meeting_report.pdf`
  doc.save(fileName)
}

export const generateActionItemsPDF = (file, completedOnly = false) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPosition = margin

  // Helper function to add text with word wrapping
  const addWrappedText = (text, x, y, maxWidth, fontSize = 12, fontStyle = 'normal') => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', fontStyle)
    
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * fontSize * 0.4) + 5
  }

  // Header
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(
    `${completedOnly ? 'Completed' : 'Pending'} Action Items`, 
    margin, 
    25
  )
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Meeting: ${file.name}`, margin, 35)
  
  yPosition = 50

  // Action Items
  const items = file.actionItems.filter(item => 
    completedOnly ? item.completed : !item.completed
  )

  if (items.length === 0) {
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `No ${completedOnly ? 'completed' : 'pending'} action items found.`,
      margin,
      yPosition
    )
  } else {
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    items.forEach((item, index) => {
      const itemText = `${index + 1}. ${item.description}`
      yPosition = addWrappedText(itemText, margin, yPosition, contentWidth, 12)
      
      const details = []
      if (item.assignedTo) details.push(`Assigned to: ${item.assignedTo}`)
      if (item.dueDate) details.push(`Due: ${new Date(item.dueDate).toLocaleDateString()}`)
      details.push(`Priority: ${item.priority}`)
      
      if (details.length > 0) {
        yPosition = addWrappedText(details.join(' | '), margin + 10, yPosition, contentWidth - 10, 10)
      }
      yPosition += 10
    })
  }

  // Save the PDF
  const fileName = `${file.name.replace(/\.[^/.]+$/, '')}_${completedOnly ? 'completed' : 'pending'}_actions.pdf`
  doc.save(fileName)
}

