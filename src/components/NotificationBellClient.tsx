'use client';
import React, { useState } from 'react';
import NotificationBell from './NotificationBell';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBellClient() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            <NotificationBell onClick={() => setDropdownOpen((v) => !v)} />
            <NotificationDropdown open={dropdownOpen} />
        </div>
    );
} 