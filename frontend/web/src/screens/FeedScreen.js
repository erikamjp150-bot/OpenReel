import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { Container, Grid, Card, CardContent, Typography, IconButton, Box, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';

const FeedScreen = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/feed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(response.data.results || []);
      } catch (error) {
        console.error('Error fetching feed:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        OpenReel Feed
      </Typography>
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} key={video.id}>
            <Card sx={{ bgcolor: '#1a1a1a', color: '#fff' }}>
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <ReactPlayer
                  url={video.video_url}
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  controls
                  playing={false}
                  light={video.thumbnail_url || true}
                />
              </Box>
              <CardContent>
                <Typography variant="h6">{video.title || 'Untitled'}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: '#aaa' }}>
                  @{video.creator_username || 'unknown'}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton size="small" sx={{ color: '#ff4444' }}>
                    <FavoriteIcon /> <Typography sx={{ ml: 1 }}>{video.like_count || 0}</Typography>
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#fff' }}>
                    <CommentIcon /> <Typography sx={{ ml: 1 }}>{video.comment_count || 0}</Typography>
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#fff' }}>
                    <ShareIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeedScreen;
