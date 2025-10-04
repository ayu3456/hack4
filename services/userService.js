// services/userService.js
'use client'
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Your backend URL

// Create axios instance with credentials
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for sending cookies
});

// Get current user data
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};


// Check authentication status
export const checkAuthStatus = async () => {
    try {
        const response = await api.get('/auth/check');
        return response.data;
    } catch (error) {
        console.error('Error checking auth status:', error);
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