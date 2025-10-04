// contexts/AuthContext.js
'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, checkAuthStatus, logoutUser } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on app start
    const checkAuth = async () => {
        try {
            console.log('🔍 Checking authentication status...');
            const response = await checkAuthStatus();
            
            if (response.isAuthenticated && response.user) {
                console.log('✅ User is authenticated with user data');
                setUser(response.user);
                setIsAuthenticated(true);
                setLoading(false);
            } else if (response.isAuthenticated) {
                console.log('🟡 User is authenticated but no user data, fetching...');
                await fetchCurrentUser();
            } else {
                console.log('❌ User not authenticated');
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        }
    };

    // Fetch current user data
    const fetchCurrentUser = async () => {
        try {
            console.log('🟡 Fetching current user data...');
            const response = await getCurrentUser();
            
            if (response.success && response.user) {
                console.log('✅ User data fetched successfully:', response.user.name);
                setUser(response.user);
                setIsAuthenticated(true);
            } else {
                console.log('❌ Failed to fetch user data - no user in response');
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('❌ Failed to fetch user:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
            setIsAuthenticated(false);
            console.log('👋 User logged out');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Check authentication when component mounts
    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated,
        checkAuth,
        logout,
        fetchCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};