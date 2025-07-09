'use client';

import { SpinnerOverlay } from '@/components/ui/spinner';
import { useLoginMutation } from '@/lib/api/auth';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [login, { isLoading, error }] = useLoginMutation();

  // Debug: Check if we already have a token
  React.useEffect(() => {
    // Check if we have cookies
    console.log('🔍 Login page mounted, checking cookies...');
    console.log('📋 Document cookies:', document.cookie);
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔐 Login attempt for user:', username);

    try {
      const res = await login({ username, password });
      console.log('🔍 Login response:', res);

      if (res.error) {
        console.log('❌ Login error:', res.error);
        toast.error('Invalid username or password');
        return;
      }

      if (res.data) {
        console.log('✅ Login successful:', res.data);
        toast.success('Login successful! Redirecting...');

        // Wait a bit for cookies to be set
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (err) {
      console.log('🚨 Login exception:', err);
      toast.error('Invalid email or password');
    }
  };
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8 dark:bg-gray-800'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            SISD Admin
          </h1>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            Welcome back! Please sign in to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <div
              className='rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300'
              role='alert'
            >
              <span className='font-semibold'>Invalid credentials.</span>
            </div>
          )}
          <div>
            <label
              htmlFor='username'
              className='block text-sm leading-6 font-medium text-gray-900 dark:text-gray-200'
            >
              Username
            </label>
            <div className='mt-2'>
              <input
                id='username'
                name='username'
                type='text'
                autoComplete='username'
                required
                autoFocus
                className='block w-full rounded-md border-0 bg-gray-100 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-blue-500'
                placeholder='admin'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className='block text-sm leading-6 font-medium text-gray-900 dark:text-gray-200'
              >
                Password
              </label>
            </div>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='block w-full rounded-md border-0 bg-gray-100 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-blue-500'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm leading-6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
      {isLoading && <SpinnerOverlay />}
    </div>
  );
}
