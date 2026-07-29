import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeed } from '../services/api';
import '../styles.css';

const FeedPage = ({ onLogout }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await getFeed();
        setVideos(response.data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>OpenReel</h1>
        <div className="header-actions">
          <Link to="/upload" className="button secondary">Upload</Link>
          <button className="button" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="feed-grid">
          {videos.map((video) => (
            <Link key={video.id} to={`/video/${video.id}`} className="video-card">
              <img src={video.thumbnail_url} alt={video.title || 'Video'} />
              <div className="video-meta">
                <div className="video-title">{video.title || 'Untitled'}</div>
                <div className="video-stats">{video.like_count} likes • {video.view_count} views</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
