'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser } from '@/hooks/use-user';
import { useSocket } from '@/hooks/use-socket';

const API_URL = 'http://localhost:3001/notifications';

export type Notification = {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
};

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: number) => Promise<void>;
    fetchMore: () => Promise<void>;
    loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // Lấy lịch sử notification khi load trang
    useEffect(() => {
        if (!user?.userId) return;
        setLoading(true);
        fetchNotifications(1, 10).then((data) => {
            setNotifications(data.items || data);
            setHasMore(data.hasMore ?? false);
            setPage(2);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [user?.userId]);

    // Nhận notification realtime qua socket
    useSocket(user?.userId, user?.role, (data: Notification) => {
        setNotifications((prev) => [data, ...prev]);
    });

    // Đánh dấu đã đọc
    const markAsRead = useCallback(async (id: number) => {
        await markNotificationAsRead(id);
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    }, []);

    // Load thêm notification (nếu có phân trang)
    const fetchMore = useCallback(async () => {
        if (!hasMore) return;
        setLoading(true);
        const data = await fetchNotifications(page, 10);
        setNotifications((prev) => [...prev, ...(data.items || data)]);
        setHasMore(data.hasMore ?? false);
        setPage((p) => p + 1);
        setLoading(false);
    }, [page, hasMore]);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, fetchMore, loading }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
    return ctx;
}

// API helpers
function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
}

async function fetchNotifications(page = 1, limit = 10) {
    const accessToken = getCookie('accessToken');
    const res = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
}

async function markNotificationAsRead(id: number) {
    const accessToken = getCookie('accessToken');
    const res = await fetch(`${API_URL}/${id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error('Failed to mark as read');
    return res.json();
} 