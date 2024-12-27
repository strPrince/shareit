import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShareIt = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const progressBarRef = useRef(null);
  const uploadTextRef = useRef(null);

  useEffect(() => {
    // Animate progress bar using GSAP
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: 'power1.out',
      });
    }
  }, [progress]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > maxSize) {
      toast.error('File size exceeds 100MB limit');
      return;
    }
    setFile(selectedFile);
    toast.info('File selected: ' + selectedFile.name);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('Uploading...');
      setProgress(0);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentage);
        },
      };

      const response = await axios.post('http://localhost:5000/api/files/upload', formData, config);
      setShareLink(response.data.url);
      setUploadStatus('File uploaded successfully!');
      setProgress(100);

      toast.success('File uploaded successfully!');

      gsap.from('.share-link', {
        opacity: 0,
        y: 20,
        duration: 0.5,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file. Please try again.');
      setProgress(0);
      toast.error('Upload failed: ' + error.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="shareit-container">
      <ToastContainer />
      <h1>Upload and Share Files</h1>

      <div
        className={`upload-section ${isDragging ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: isDragging ? '#e3f2fd' : 'transparent',
          transition: 'background-color 0.3s ease'
        }}
      >
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-input"
          accept="*/*"
        />
        <label htmlFor="file-input" className={`drop-zone ${isDragging ? 'active' : ''}`}>
          {file ? file.name : 'Drag and drop files here or click to select'}
        </label>
       
      </div>
      <button onClick={handleUpload} className={`upload-button ${file ? 'active' : ''}`} disabled={!file} style={{ marginTop: '1rem' }}>
          Upload File
        </button>

      {uploadStatus && <p ref={uploadTextRef} className="status-message">{uploadStatus}</p>}

      {/* {progress > 0 && (
        <div className="progress-bar-container">
          <div ref={progressBarRef} className="progress-bar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )} */}

      {shareLink && (
        <div className="share-link" >
          <div className="link-container" >
            <button
  className="minimal-button"
  onClick={() => {
    navigator.clipboard.writeText(shareLink);
    toast.info('Link copied to clipboard!');
  }}
>
  { 'Copy Link'}
</button>          </div>
          <a 
            href={shareLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="minimal-link"
           
          >
            View file →
          </a>
        </div>
      )}
    </div>
  );
};

export default ShareIt;
