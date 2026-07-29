import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import UploadPage from './pages/UploadPage';
import { setAuthToken, getAuthToken, removeTokens } from './services/api';

const App = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadToken = async () => {
      const authToken = await getAuthToken();
      setToken(authToken);
    };
    loadToken();
  }, []);

  const handleLogin = async (accessToken, refreshToken) => {
    await setAuthToken(accessToken, refreshToken);
    setToken(accessToken);
    navigate('/feed');
  };

  const handleLogout = async () => {
    await removeTokens();
    setToken(null);
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/feed"
        element={token ? <FeedPage onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/video/:id"
        element={token ? <VideoPlayerPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/upload"
        element={token ? <UploadPage /> : <Navigate to="/login" replace />}
      />
      <Route path="/*" element={<Navigate to={token ? '/feed' : '/login'} replace />} />
    </Routes>
  );
};

export default App;
