'use client';
import Providers from './providers';

export default function ClientProvidersWrapper({ activeThemeValue, children }: { activeThemeValue: string; children: React.ReactNode; }) {
    return <Providers activeThemeValue={activeThemeValue}>{children}</Providers>;
} 