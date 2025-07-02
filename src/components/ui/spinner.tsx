import React from 'react';

export const Spinner: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 24
}) => (
  <svg
    className={`animate-spin text-gray-500 ${className}`}
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
    />
  </svg>
);

export const SpinnerOverlay: React.FC<{
  className?: string;
  size?: number;
  children?: React.ReactNode;
}> = ({ className = '', size = 48, children }) => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 ${className}`}
  >
    <Spinner size={size} />
    {children}
  </div>
);

export default Spinner;
