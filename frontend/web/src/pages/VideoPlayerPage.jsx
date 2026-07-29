import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import '../styles.css';

const VideoPlayerPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const response = await apiClient.get(`/feed/${id}`);
        setVideo(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadVideo();
  }, [id]);

  if (!video) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/feed" className="button secondary">Back</Link>
      </div>
      <div className="video-player-wrapper">
        <video controls src={video.video_url} className="video-player" />
        <div className="video-details">
          <h2>{video.title || 'Untitled'}</h2>
          <p>{video.description}</p>
          <div className="video-actions">
            <span>{video.like_count} likes</span>
            <span>{video.comment_count || 0} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
