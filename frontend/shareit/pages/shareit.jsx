import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../src/App.css'; // Ensure this is styled as per dark theme

const ShareIt = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [Isuploading, setIsuploading] = useState(false);

  const progressBarRef = useRef(null);

  useEffect(() => {
    // GSAP progress animation
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
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > maxSize) {
      toast.error('File size exceeds 100MB limit');
      return;
    }
    setFile(selectedFile);
    toast.info(`File selected: ${selectedFile.name}`);
  };


  // Gradient animation
  const containerRef = useRef(null);
  const animationFrameId = useRef(null); // To store requestAnimationFrame ID
  
  useEffect(() => {
    if (Isuploading && containerRef.current) {
      const colors = ['#082d40', '#236c7b', '#1b5864'];
      let position = 0;
  
      const animate = () => {
        if (!Isuploading) {
          // Stop animation when Isuploading is false
          if (containerRef.current) {
            containerRef.current.style.background = '#1a1a1a'; // Reset to dark background
          }
          return;
        }
  
        position = (position + 1) % 360;
        const gradient = `linear-gradient(${position}deg, ${colors.join(', ')})`;
        if (containerRef.current) {
          containerRef.current.style.background = gradient;
        }
  
        animationFrameId.current = requestAnimationFrame(animate); // Store the animation frame ID
      };
  
      animate();
    } else if (containerRef.current) {
      containerRef.current.style.background = '#1a1a1a'; // Reset to dark background
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current); // Cancel the animation
      }
    }
  


    // Cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [Isuploading]);

const newFileRef = useRef(null);

  useEffect(() => {
    if (!Isuploading && newFileRef.current) {
      const colors = ['#250916', '#340e28'];
      let position = 0;

      const animate = () => {
        if (!Isuploading) {
          // Stop animation when Isuploading is false
          if (newFileRef.current) {
            newFileRef.current.style.background = '#1a1a1a'; // Reset to dark background
          }
          position = (position + 1) % 90;
          const gradient = `linear-gradient(${position}deg, ${colors.join(', ')})`;
          if (newFileRef.current) {
            newFileRef.current.style.background = gradient;
          }
    
          animationFrameId.current = requestAnimationFrame(animate); 
        }
      }

      animate();
    };



    function animate() {
      if (!Isuploading) {
        // Stop animation when Isuploading is false 
        if (newFileRef.current) {
          newFileRef.current.style.background = '#1a1a1a'; // Reset to dark background
        }
        return;
        }
    }
  }, [Isuploading]);



  const handleUpload = async () => {
    if (!file) {
      toast.warning('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('Uploading...');
      setIsuploading(true);
      setProgress(0);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentage);
          if (percentage === 100) {
            setUploadStatus('File uploaded successfully!');
            setIsuploading(false);
          }
        },
      };

      const response = await axios.post('https://shareit-1.onrender.com/api/files/upload', formData, config);
      setShareLink(response.data.url);
      setUploadStatus('File uploaded successfully!');
      setProgress(100);

      toast.success('File uploaded successfully!');
      setUploadedFiles([...uploadedFiles, { name: file.name, size: file.size, url: response.data.url }]);

      gsap.from('.uploaded-files', {
        opacity: 0,
        y: 20,
        duration: 0.5,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file. Please try again.');
      setProgress(0);
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
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
    <>
    <div   style={{ height: '100vh', overflow: 'hidden' }}>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: '#1a1a1a',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '96%',
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0, color: '#ffffff' }}>ShareIt</h2>
        <a
          href="https://github.com/strPrince/shareit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            style={{
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            GitHub
          </button>
        </a>
      </nav>

      <div className="shareit-container" style={{ marginTop: '80px', color: '#ffffff', textAlign: 'center',width: '100vw', }}>
        <ToastContainer />
        <h1 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Upload and Share Files</h1>

        <div
        ref={newFileRef}
          className={`upload-section ${isDragging ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            marginTop:'100px',
            border: `2px dashed ${isDragging ? '#007bff' : '#444'}`, 
             padding: '20px',
             height: '100px',
             display: 'flex',
            justifyContent: 'center', 
            alignItems: 'center',
            margin: '1rem auto',
            maxWidth: '600px',
            backgroundColor: isDragging ? '#333' : 'transparent',
            transition: 'background-color 0.3s ease',
            color: '#ddd',
          }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
            accept="*/*"
          />
          <label
            htmlFor="file-input"
            style={{ cursor: 'pointer', display: 'block', fontSize: '1.2rem' }}
          >
            {file ? file.name : 'Drag and drop files here or click to select'}
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file}
          style={{
            marginTop: '1rem',
            padding: '0.8rem 2rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: file ? '#007bff' : '#444',
            color: '#fff',
            cursor: file ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
          }}
        >
          Upload File
        </button>

        {uploadStatus && <p style={{ marginTop: '1rem' }}>{uploadStatus}</p>}

        {uploadedFiles.length > 0 && (
          <div className="uploaded-files" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Uploaded Files</h2>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem',
                  backgroundColor: '#222',
                  borderRadius: '4px',
                  width: '70%',
                  justifySelf: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span style={{ color: '#fff',width: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                <a
                  href={file.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(file.url);
                    toast.success('Link copied to clipboard!');
                  }}
                  style={{
                    textDecoration: 'none',
                    color: '#007bff', 
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Share
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default ShareIt;
