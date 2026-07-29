import axios from 'axios';

export const API_BASE = 'http://localhost:8000';

const authTokenKey = 'auth_token';
const refreshTokenKey = 'refresh_token';

export const getAuthToken = async () => {
  return localStorage.getItem(authTokenKey);
};

export const setAuthToken = async (accessToken, refreshToken) => {
  localStorage.setItem(authTokenKey, accessToken);
  localStorage.setItem(refreshTokenKey, refreshToken);
};

export const removeTokens = async () => {
  localStorage.removeItem(authTokenKey);
  localStorage.removeItem(refreshTokenKey);
};

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.endsWith('/auth/refresh')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(refreshTokenKey);
      if (!refreshToken) {
        await removeTokens();
        return Promise.reject(error);
      }
      try {
        const response = await axios.post(`${API_BASE}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        localStorage.setItem(authTokenKey, response.data.access_token);
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await removeTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getFeed = async (page = 1, pageSize = 20) => {
  return apiClient.get('/feed', {
    params: { page, page_size: pageSize },
  });
};

export const uploadVideo = async (formData, onUploadProgress) => {
  return apiClient.post('/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};

export default apiClient;
