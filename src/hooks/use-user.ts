'use client';

import { extractJWTPayload } from '@/lib/jwt-edge';
import { useEffect, useState } from 'react';

interface User {
    userId: string;
    email: string;
    role: string;
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        const accessToken = getCookie('accessToken');

        if (accessToken) {
            try {
                const payload = extractJWTPayload(accessToken);
                setUser({
                    userId: payload.userId || payload.sub || '',
                    email: payload.email || '',
                    role: payload.role || payload.rule || ''
                });
            } catch (error) {
                console.error('Failed to extract user from token:', error);
                setUser(null);
            }
        } else {
            setUser(null);
        }

        setLoading(false);
    }, []);

    return { user, loading };
} 