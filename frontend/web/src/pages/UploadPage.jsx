import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { uploadVideo } from '../services/api';
import '../styles.css';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setStatus('Please choose a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    try {
      setStatus('Uploading...');
      const response = await uploadVideo(formData, (progressEvent) => {
        const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setProgress(pct);
      });
      setStatus(`Uploaded video ${response.data.id}`);
    } catch (err) {
      console.error(err);
      setStatus('Upload failed');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/feed" className="button secondary">Back</Link>
      </div>
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Upload Video</h1>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
        />
        <button type="submit">Upload</button>
        {progress > 0 && <div className="progress-text">Uploading {progress}%</div>}
        {status && <div className="status-text">{status}</div>}
      </form>
    </div>
  );
};

export default UploadPage;
