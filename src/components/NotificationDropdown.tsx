import React from 'react';
import { useNotification } from '@/context/NotificationContext';

export default function NotificationDropdown({ open }: { open: boolean }) {
    const { notifications, markAsRead, fetchMore, loading } = useNotification();
    if (!open) return null;
    return (
        <div style={{
            position: 'absolute', top: 40, right: 0, width: 350, background: '#fff',
            border: '1px solid #eee', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 1000
        }}>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {notifications.length === 0 && <div style={{ padding: 16 }}>Không có thông báo nào.</div>}
                {notifications.map((n) => (
                    <div key={n.id} style={{
                        padding: 12, borderBottom: '1px solid #f0f0f0',
                        background: n.is_read ? '#f9f9f9' : '#e6f7ff',
                        fontWeight: n.is_read ? 'normal' : 'bold',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                        onClick={() => markAsRead(n.id)}
                    >
                        <div>{n.title}</div>
                        <div style={{ fontSize: 13, color: '#555' }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{new Date(n.created_at).toLocaleString()}</div>
                    </div>
                ))}
            </div>
            <button onClick={fetchMore} style={{ width: '100%', padding: 8, border: 'none', background: '#f0f0f0', cursor: 'pointer' }} disabled={loading}>
                {loading ? 'Đang tải...' : 'Xem thêm'}
            </button>
        </div>
    );
} 