// services/userService.js
'use client'
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// Create axios instance with credentials
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Get current user data
export const getCurrentUser = async () => {
  try {
    console.log('🟡 Fetching user data from /auth/user...');
    const response = await api.get('/auth/user');
    console.log('✅ User data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching user data:');
    if (error.response) {
      console.error('Server response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    throw error;
  }
};

// Check authentication status
export const checkAuthStatus = async () => {
    try {
        console.log('🟡 Checking auth status...');
        const response = await api.get('/auth/check');
        console.log('✅ Auth status response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error checking auth status:', error);
        throw error;
    }
};

// Logout user
export const logoutUser = async () => {
    try {
        const response = await api.get('/auth/logout');
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};