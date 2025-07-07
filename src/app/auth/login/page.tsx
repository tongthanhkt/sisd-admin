'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //   const handleChange = (e: any) => {
  //     setForm({ ...form, [e.target.name]: e.target.value });
  //     setError('');
  //   };

  //   const handleSubmit = async (e: any) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     setError('');
  //     try {
  //       const res = await fetch('/api/auth/login', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(form)
  //       });
  //       const data = await res.json();
  //       if (!res.ok) {
  //         setError(data.message || 'Đăng nhập thất bại');
  //       } else {
  //         localStorage.setItem('accessToken', data.accessToken);
  //         window.location.href = '/dashboard';
  //       }
  //     } catch {
  //       setError('Có lỗi xảy ra, thử lại sau.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <form
        method='POST'
        action='/api/auth/login'
        className='w-full max-w-xs space-y-4 rounded bg-white p-8 shadow'
      >
        <h2 className='mb-4 text-center text-2xl font-bold'>Admin Login</h2>
        <input
          type='text'
          name='username'
          placeholder='Username'
          className='w-full rounded border px-3 py-2 focus:ring focus:outline-none'
          autoFocus
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          className='w-full rounded border px-3 py-2 focus:ring focus:outline-none'
          required
        />
        {error && <div className='text-sm text-red-500'>{error}</div>}
        <button
          type='submit'
          className='w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700'
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
