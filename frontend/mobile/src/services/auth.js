import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const loginUser = async (credentials) => {
    return axios.post(`${API_BASE}/auth/login`, credentials);
};

export const registerUser = async (payload) => {
    return axios.post(`${API_BASE}/auth/register`, payload);
};

export const logoutUser = async () => {
    return axios.post(`${API_BASE}/auth/logout`);
};
