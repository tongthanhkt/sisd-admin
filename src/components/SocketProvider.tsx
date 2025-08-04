'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Tạo kết nối socket
        const socketIo = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
            withCredentials: false, // nếu server bật cors credentials
        });

        setSocket(socketIo);

        // Ví dụ: lắng nghe sự kiện login để hiện toast
        socketIo.on('user-logged-in', (data: { userId: number; email: string; loginTime: string }) => {
            toast.success(`👤 ${data.email} vừa đăng nhập`, {
                description: new Date(data.loginTime).toLocaleString(),
            });
        });

        socketIo.on('connect', () => {
            console.log('Socket connected:', socketIo.id);
        });

        return () => {
            socketIo.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
