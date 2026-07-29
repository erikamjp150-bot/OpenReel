import axios from 'axios';
import { API_BASE } from './api';

export const loginUser = async (credentials) => {
  return axios.post(`${API_BASE}/auth/login`, credentials);
};

export const registerUser = async (payload) => {
  return axios.post(`${API_BASE}/auth/register`, payload);
};
