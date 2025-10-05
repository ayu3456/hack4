
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
    console.log(':large_yellow_circle: Fetching user data from /auth/user...');
    const response = await api.get('/auth/user');
    console.log(':white_check_mark: User data response:', response.data);
    return response.data;
  } catch (error) {
    console.error(':x: Error fetching user data:');
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
// Get user PR data
export const getUserPRs = async () => {
  try {
    console.log(':large_yellow_circle: Fetching PR data from /auth/user/prs...');
    const response = await api.get('/auth/user/prs');
    console.log(':white_check_mark: PR data response:', response.data);
    return response.data;
  } catch (error) {
    console.error(':x: Error fetching PR data:');
    if (error.response) {
      console.error('Server response:', error.response.status, error.response.data);
      if (error.response.status === 404) {
        console.error('User or GitHub token not found - user might not have connected GitHub');
      }
    }
    throw error;
  }
};
// Check authentication status
export const checkAuthStatus = async () => {
    try {
        console.log(':large_yellow_circle: Checking auth status...');
        const response = await api.get('/auth/check');
        console.log(':white_check_mark: Auth status response:', response.data);
        return response.data;
    } catch (error) {
        console.error(':x: Error checking auth status:', error);
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


export const getLeaderboard = async () => {
  try {
    console.log('🟡 Fetching leaderboard data from /auth/users...');
    const response = await api.get('/auth/users');
    console.log('✅ Leaderboard response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching leaderboard data:');
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