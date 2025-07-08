import { toast } from 'sonner';

export const handleAuthError = (error: any) => {
  if (error.status === 401) {
    console.log('🚨 Auth Error: Logging out due to 401');

    // Clear any client-side storage if needed
    localStorage.clear();

    // Show error message
    toast.error('Session expired. Please login again.');

    // Redirect to login
    window.location.href = '/auth/login';

    return true; // Indicate that auth error was handled
  }

  return false; // Not an auth error
};

export const setupAuthInterceptor = () => {
  // This can be used to setup global fetch interceptor if needed
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (response.status === 401) {
      handleAuthError({ status: 401 });
    }

    return response;
  };
};
