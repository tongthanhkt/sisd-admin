import { extractJWTPayload } from './jwt-edge';

export const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

export const setCookie = (name: string, value: string, days: number) => {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

export const removeCookie = (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = extractJWTPayload(token);
        const now = Math.floor(Date.now() / 1000);
        return payload.exp ? payload.exp <= now : true;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
};

export const getTokenExpirationTime = (token: string): number | null => {
    try {
        const payload = extractJWTPayload(token);
        return payload.exp || null;
    } catch (error) {
        console.error('Error getting token expiration time:', error);
        return null;
    }
};

export const getTimeUntilExpiry = (token: string): number => {
    try {
        const payload = extractJWTPayload(token);
        const exp = payload.exp;

        if (!exp) {
            return 0;
        }

        const now = Math.floor(Date.now() / 1000);
        return Math.max(exp - now, 0);
    } catch (error) {
        console.error('Error calculating time until expiry:', error);
        return 0;
    }
};

export const shouldRefreshToken = (token: string, bufferSeconds: number = 30): boolean => {
    const timeUntilExpiry = getTimeUntilExpiry(token);
    return timeUntilExpiry <= bufferSeconds;
};

export const clearAuthCookies = () => {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('userId');
    removeCookie('userRole');
};

export const clearAllAuthData = () => {
    if (typeof document === 'undefined') return;

    // Xóa tất cả cookies liên quan đến authentication
    clearAuthCookies();

    // Xóa thêm các cookies khác có thể được sử dụng
    const cookiesToRemove = [
        'accessToken',
        'refreshToken',
        'userId',
        'userRole',
        'session',
        'auth',
        'token',
        'jwt',
        'user',
        'login',
        'remember',
        'persist'
    ];

    cookiesToRemove.forEach(cookieName => {
        // Xóa với các path khác nhau
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/dashboard;`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/auth;`;
    });

    // Xóa localStorage và sessionStorage nếu có
    try {
        localStorage.clear();
        sessionStorage.clear();
    } catch (error) {
        console.warn('Could not clear storage:', error);
    }
}; 