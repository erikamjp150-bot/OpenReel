import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FeedScreen from './screens/FeedScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';
import UploadScreen from './screens/UploadScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';

function App() {
  const token = localStorage.getItem('access_token');
  
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/" element={token ? <FeedScreen /> : <Navigate to="/login" />} />
      <Route path="/video/:id" element={token ? <VideoPlayerScreen /> : <Navigate to="/login" />} />
      <Route path="/upload" element={token ? <UploadScreen /> : <Navigate to="/login" />} />
      <Route path="/profile/:username?" element={token ? <ProfileScreen /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
