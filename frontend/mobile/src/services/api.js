import axios from 'axios';
import { secureStore } from './secureStore';

export const API_BASE = 'http://localhost:8000';

const getAuthToken = async () => {
    return await secureStore.get('auth_token');
};

const setAuthToken = async (token) => {
    await secureStore.set('auth_token', token);
};

const getRefreshToken = async () => {
    return await secureStore.get('refresh_token');
};

const removeTokens = async () => {
    await secureStore.remove('auth_token');
    await secureStore.remove('refresh_token');
};

let authFailureHandler = null;
export const setAuthFailureHandler = (handler) => {
    authFailureHandler = handler;
};

export const apiClient = axios.create({
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
            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) {
                    await removeTokens();
                    return Promise.reject(error);
                }
                const response = await axios.post(`${API_BASE}/auth/refresh`, {
                    refresh_token: refreshToken,
                });
                await setAuthToken(response.data.access_token);
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

export const postInteraction = async (interaction) => {
    return apiClient.post('/interactions', interaction);
};

export const uploadVideo = async (formData, onUploadProgress) => {
    return apiClient.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
    });
};
