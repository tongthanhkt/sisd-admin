'use client';

import { useEffect, useRef } from 'react';
import { refreshAccessToken } from '@/lib/auth-interceptor';
import { getCookie, getTimeUntilExpiry } from '@/lib/token-utils';

export function useAutoRefresh() {
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scheduleRefresh = () => {
        console.log('🔄 Scheduling auto refresh: refreshToken ', getCookie('refreshToken'));
        const accessToken = getCookie('accessToken');

        if (!accessToken) {
            console.log('No access token found, skipping auto refresh');
            return;
        }

        try {
            const timeUntilExpiry = getTimeUntilExpiry(accessToken);

            if (timeUntilExpiry <= 0) {
                console.log('Token already expired, triggering immediate refresh');
                refreshAccessToken();
                return;
            }

            // Refresh token 30 seconds before expiry (for 1-minute tokens)
            const refreshTime = Math.max(timeUntilExpiry - 60, 0) * 1000; // Convert to milliseconds

            console.log(`🕐 Token expires in ${timeUntilExpiry} seconds. Will refresh in ${Math.floor(refreshTime / 1000)} seconds.`);

            // Clear existing timeout
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }

            // Schedule refresh
            refreshTimeoutRef.current = setTimeout(async () => {
                console.log('🔄 Auto-refresh triggered');
                const newToken = await refreshAccessToken();
                if (newToken) {
                    console.log('✅ Auto-refresh successful, scheduling next refresh');
                    // Schedule next refresh
                    scheduleRefresh();
                } else {
                    console.log('❌ Auto-refresh failed');
                }
            }, refreshTime);

        } catch (error) {
            console.error('Error scheduling auto refresh:', error);
        }
    };

    useEffect(() => {
        // Schedule initial refresh
        scheduleRefresh();

        // Cleanup on unmount
        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);

    return { refreshAccessToken, scheduleRefresh };
} 