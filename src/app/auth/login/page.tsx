export default function LoginPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const error = searchParams?.error;
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

        <form method='POST' action='/api/auth/login' className='space-y-6'>
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
    </div>
  );
}
