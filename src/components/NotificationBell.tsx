'use client';
import React from 'react';
import { useNotification } from '@/context/NotificationContext';

export default function NotificationBell({ onClick }: { onClick: () => void }) {
    const { unreadCount } = useNotification();

    return (
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onClick}>
            <span role="img" aria-label="bell" style={{ fontSize: 24 }}>🔔</span>
            {unreadCount > 0 && (
                <span style={{
                    position: 'absolute', top: 0, right: 0,
                    background: 'red', color: 'white', borderRadius: '50%',
                    width: 18, height: 18, fontSize: 12, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', border: '2px solid #fff'
                }}>
                    {unreadCount}
                </span>
            )}
        </div>
    );
} 