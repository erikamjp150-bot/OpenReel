import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';
import '../styles.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser({ username, password });
      onLogin(response.data.access_token, response.data.refresh_token);
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="page-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
        {error && <div className="error-text">{error}</div>}
        <button type="submit">Login</button>
        <button type="button" className="link-button" onClick={() => navigate('/register')}>
          Create account
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
