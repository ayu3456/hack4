// contexts/AuthContext.js
'use client'
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { 
    getCurrentUser, 
    getUserPRs, 
    checkAuthStatus, 
    logoutUser, 
    getLeaderboard 
} from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [prData, setPrData] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [prLoading, setPrLoading] = useState(false);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Use refs to track current state to avoid race conditions
    const isAuthenticatedRef = useRef(false);
    const userRef = useRef(null);

    // Update refs when state changes
    useEffect(() => {
        isAuthenticatedRef.current = isAuthenticated;
        userRef.current = user;
    }, [isAuthenticated, user]);

    // Check if user is logged in on app start
    const checkAuth = async () => {
        try {
            console.log('🔍 Checking authentication status...');
            const response = await checkAuthStatus();
            
            if (response.isAuthenticated && response.user) {
                console.log('✅ User is authenticated with user data');
                setUser(response.user);
                setIsAuthenticated(true);
                isAuthenticatedRef.current = true;
                userRef.current = response.user;
                
                // Check if user already has PR data from previous session
                if (response.user.stats || response.user.prs) {
                    console.log('📊 Found existing PR data in user object');
                    setPrData({
                        stats: response.user.stats,
                        prs: response.user.prs
                    });
                } else {
                    console.log('🔄 No existing PR data, will fetch fresh data');
                    // Auto-fetch PR data when user is authenticated
                    setTimeout(() => fetchPRData(), 500);
                }
                
                // Auto-fetch leaderboard when user is authenticated
                setTimeout(() => fetchLeaderboard(), 1000);
                setLoading(false);
            } else if (response.isAuthenticated) {
                console.log('🟡 User is authenticated but no user data, fetching...');
                await fetchCurrentUser();
            } else {
                console.log('❌ User not authenticated');
                setUser(null);
                setIsAuthenticated(false);
                isAuthenticatedRef.current = false;
                userRef.current = null;
                setLoading(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            isAuthenticatedRef.current = false;
            userRef.current = null;
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
                isAuthenticatedRef.current = true;
                userRef.current = response.user;
                
                // If user already has PR data from previous session, set it
                if (response.user.stats || response.user.prs) {
                    console.log('📊 Found PR data in user response');
                    setPrData({
                        stats: response.user.stats,
                        prs: response.user.prs
                    });
                } else {
                    console.log('🔄 No PR data in user response, will fetch fresh');
                    // Auto-fetch PR data
                    setTimeout(() => fetchPRData(), 500);
                }
                
                // Auto-fetch leaderboard
                setTimeout(() => fetchLeaderboard(), 1000);
            } else {
                console.log('❌ Failed to fetch user data - no user in response');
                setUser(null);
                setIsAuthenticated(false);
                isAuthenticatedRef.current = false;
                userRef.current = null;
            }
        } catch (error) {
            console.error('❌ Failed to fetch user:', error);
            setUser(null);
            setIsAuthenticated(false);
            isAuthenticatedRef.current = false;
            userRef.current = null;
        } finally {
            setLoading(false);
        }
    };

    // Fetch PR data separately - FIXED: Use refs to avoid race conditions
    const fetchPRData = async () => {
        // Use refs instead of state to get current values
        const currentIsAuthenticated = isAuthenticatedRef.current;
        const currentUser = userRef.current;
        
        console.log('🔄 fetchPRData called with:', { 
            currentIsAuthenticated, 
            currentUser: currentUser ? currentUser.name : 'none' 
        });
        
        if (!currentIsAuthenticated || !currentUser) {
            console.log('❌ Cannot fetch PR data: User not authenticated or no user data');
            return null;
        }
        
        try {
            setPrLoading(true);
            console.log('🟡 Fetching PR data from GitHub...');
            const response = await getUserPRs();
            
            if (response.success) {
                console.log('✅ PR data fetched successfully');
                const newPRData = {
                    stats: response.stats,
                    prs: response.prs
                };
                setPrData(newPRData);
                
                // Update user with the new PR data
                setUser(prevUser => ({
                    ...prevUser,
                    stats: response.stats,
                    prs: response.prs
                }));
                
                return newPRData;
            } else {
                console.log('❌ Failed to fetch PR data - no data in response');
                return null;
            }
        } catch (error) {
            console.error('❌ Failed to fetch PR data:', error);
            
            // Check if it's a GitHub token issue
            if (error.response?.status === 404) {
                console.error('🔑 GitHub token might be missing or invalid');
            }
            
            return null;
        } finally {
            setPrLoading(false);
        }
    };

    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
        try {
            setLeaderboardLoading(true);
            console.log('🟡 Fetching leaderboard data...');
            const response = await getLeaderboard();
            
            if (response.success && response.users) {
                console.log('✅ Leaderboard data fetched successfully:', response.users.length, 'users');
                setLeaderboard(response.users);
                return response.users;
            } else {
                console.log('❌ Failed to fetch leaderboard - no users in response');
                return null;
            }
        } catch (error) {
            console.error('❌ Failed to fetch leaderboard:', error);
            return null;
        } finally {
            setLeaderboardLoading(false);
        }
    };

    // Refresh all data
    const refreshUserData = async () => {
        await fetchCurrentUser();
        await fetchPRData();
        await fetchLeaderboard();
    };

    // Logout function
    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
            setPrData(null);
            setLeaderboard([]);
            setIsAuthenticated(false);
            isAuthenticatedRef.current = false;
            userRef.current = null;
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
        prData,
        leaderboard,
        loading,
        prLoading,
        leaderboardLoading,
        isAuthenticated,
        checkAuth,
        logout,
        fetchCurrentUser,
        fetchPRData,
        fetchLeaderboard,
        refreshUserData
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};