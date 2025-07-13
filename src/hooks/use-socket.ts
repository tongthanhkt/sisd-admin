'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001'; // Đổi thành URL backend nếu cần

export function useSocket(userId: number | string | undefined, role: string | undefined, onNotification: (data: any) => void) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userId || !role) return;

        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join', { userId, role });
            if (role === 'admin') {
                socket.emit('join', { userId: 'admin_room', role });
            }
        });

        socket.on('notification', onNotification);
        if (role === 'admin') {
            socket.on('admin_notification', onNotification);
        }

        return () => {
            socket.disconnect();
        };
    }, [userId, role, onNotification]);

    return socketRef;
} 