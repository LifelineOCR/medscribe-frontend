// src/pages/UploadPage.js
import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { uploadDocument } from '../services/api';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(''); // For image previews
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);


  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadStatus(''); // Clear previous status

    // Basic image preview (extend for other file types if needed)
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc(''); // Clear preview if not an image or no file
    }
  };

  const handleSubmitUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }
    setIsUploading(true);
    setUploadStatus(`Uploading ${selectedFile.name}...`);
    try {
      const response = await uploadDocument(selectedFile);
      setUploadStatus(response.message || 'Document uploaded successfully. Processing initiated.');
      // Consider resetting file input after successful upload
      // setSelectedFile(null);
      // setPreviewSrc('');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Error uploading document: ${error.message}`);
    }
    setIsUploading(false);
  };

  return (
    <div>
      <h1 className="page-title">UPLOAD DOCUMENT</h1>
      <div className="upload-page-layout">
        <div className="card">
          <h3 style={{textAlign: 'center', textTransform: 'uppercase'}}>SELECT FILE</h3>
          <FileUpload
            onFileSelect={handleFileSelect}
            instructionText="DRAG FILE HERE OR CLICK TO BROWSE"
            browseButtonText="BROWSE FILES" /* This button should be part of FileUpload or styled here */
            showIcon={true}
          />
		   {/* Show upload button only if a file is selected */}

           {selectedFile && (
             <div style={{textAlign: 'center', marginTop: '20px'}}>
                <button onClick={handleSubmitUpload} className="button-primary" disabled={isUploading}>
                  {isUploading ? 'UPLOADING...' : `UPLOAD ${selectedFile.name}`}
                </button>
             </div>
           )}

        </div>
        <div className="card">
          <h3 style={{textAlign: 'center', textTransform: 'uppercase'}}>PREVIEW</h3>
          <div className="preview-area">
            {previewSrc ? (
              <img src={previewSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : selectedFile ? (
              <p>{selectedFile.name} selected. Preview not available for this file type.</p>
            ) : (
              <p>NO FILE SELECTED</p>
            )}
          </div>
        </div>
      </div>
      {uploadStatus && <p style={{ textAlign: 'center', marginTop: '20px', color: uploadStatus.includes('Error') ? 'red' : '#39FF14' }}>{uploadStatus}</p>}
    </div>
  );
};

export default UploadPage;