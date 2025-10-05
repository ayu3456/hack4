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
    console.log('🔍 Fetching user data from /auth/user...');
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

// Get user PR data - FIXED ENDPOINT
export const getUserPRs = async () => {
  try {
    console.log('🔍 Fetching PR data from /auth/user/prs...');
    const response = await api.get('/auth/user/prs'); // Changed from /auth/prs to /auth/user/prs
    console.log('✅ PR data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching PR data:');
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
        console.log('🔍 Checking auth status...');
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
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};

// Get user by username - ADD FALLBACK FOR MISSING ENDPOINT
export const getUserByUsername = async (username) => {
    try {
        console.log(`🔍 Fetching user by username: ${username}`);
        const response = await api.get(`/api/users/${username}`);
        console.log('✅ User by username response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching user by username:', error);
        
        // If endpoint doesn't exist, return a fallback response
        if (error.response && error.response.status === 404) {
            console.log('🔄 User endpoint not found, using fallback');
            return {
                success: false,
                message: "User endpoint not available",
                fallback: true
            };
        }
        
        if (error.response) {
            console.error('Server response:', error.response.status, error.response.data);
        }
        throw error;
    }
};

// Get leaderboard data - ADD FALLBACK FOR MISSING ENDPOINT
export const getLeaderboard = async () => {
    try {
        console.log('🔍 Fetching leaderboard data...');
        const response = await api.get('/api/users/leaderboard/all');
        console.log('✅ Leaderboard response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching leaderboard:', error);
        
        // If endpoint doesn't exist, return a fallback response
        if (error.response && error.response.status === 404) {
            console.log('🔄 Leaderboard endpoint not found, using fallback');
            return {
                success: false,
                message: "Leaderboard endpoint not available",
                fallback: true
            };
        }
        
        if (error.response) {
            console.error('Server response:', error.response.status, error.response.data);
        }
        throw error;
    }
};

// Update user profile - ADD FALLBACK FOR MISSING ENDPOINT
export const updateUserProfile = async (userId, updateData) => {
    try {
        console.log(`📝 Updating user profile for: ${userId}`);
        const response = await api.put(`/api/users/${userId}`, updateData);
        console.log('✅ Profile update response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error updating user profile:', error);
        
        // If endpoint doesn't exist, return a fallback response
        if (error.response && error.response.status === 404) {
            console.log('🔄 Profile update endpoint not found');
            return {
                success: false,
                message: "Profile update endpoint not available",
                fallback: true
            };
        }
        
        if (error.response) {
            console.error('Server response:', error.response.status, error.response.data);
        }
        throw error;
    }
};

// Get all users for leaderboard (alternative endpoint)
export const getAllUsers = async () => {
    try {
        console.log('🔍 Fetching all users...');
        const response = await api.get('/auth/leaderboard');
        console.log('✅ All users response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching all users:', error);
        throw error;
    }
};