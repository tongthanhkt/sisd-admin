'use client';
import React, { useCallback, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { useSocket } from '@/hooks/use-socket';

export default function NotificationListener() {
    const { user } = useUser();
    const [notifications, setNotifications] = useState<any[]>([]);

    // Xử lý khi nhận notification
    const handleNotification = useCallback((data: any) => {
        setNotifications((prev) => [data, ...prev]);
        // Hiển thị toast hoặc UI tuỳ ý
        if (window?.Notification && Notification.permission === 'granted') {
            new Notification(data.title, { body: data.message });
        } else {
            // Có thể thay alert bằng toast UI đẹp hơn
            alert(`${data.title}\n${data.message}`);
        }
    }, []);

    useSocket(user?.userId, user?.role, handleNotification);

    return (
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
            {notifications.map((n, idx) => (
                <div key={n.id || idx} style={{
                    background: '#fff',
                    border: '1px solid #eee',
                    borderRadius: 8,
                    marginBottom: 8,
                    padding: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <strong>{n.title}</strong>
                    <div>{n.message}</div>
                    <small>{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</small>
                </div>
            ))}
        </div>
    );
} 