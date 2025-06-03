// src/components/FileUpload.js
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileSelect, instructionText, browseButtonText, showIcon = true }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true, // We'll use our own button or make the whole area clickable
    noKeyboard: true,
    multiple: false,
    // accept: 'image/*,application/pdf', // Example: specify accepted file types
  });

  const handleBrowseClick = (e) => {
    e.stopPropagation(); // Prevent triggering dropzone's own click if it's part of getRootProps
    open(); // Open file dialog
  };

  return (
    <div {...getRootProps()} className="file-upload-area" onClick={open} > {/* Make whole area clickable */}
      <input {...getInputProps()} />
      {showIcon && <div className="icon">📄</div>} {/* Simple text icon */}
      <p>{selectedFile ? selectedFile.name : instructionText || "UPLOAD MEDICAL DOCUMENT"}</p>
      <span>
        {isDragActive ?
          "Drop the files here ..." :
          selectedFile ? `1 file selected. Click to change or drag new file.` : "DRAG AND DROP YOUR SCANNED DOCUMENT OR CLICK TO BROWSE"}
      </span>
      {browseButtonText && !selectedFile && (
        <div style={{ marginTop: '15px' }}>
          <button type="button" className="button-primary" onClick={handleBrowseClick}>
            {browseButtonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;