'use client';

import { useAutoRefresh } from '@/hooks/use-auto-refresh';

export default function AutoRefreshProvider({
    children
}: {
    children: React.ReactNode;
}) {
    // Initialize auto refresh hook
    // useAutoRefresh();

    return <>{children}</>;
} 