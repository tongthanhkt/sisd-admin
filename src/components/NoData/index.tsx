import React from 'react';
import { FileX } from 'lucide-react';

const NoData = () => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='my-4 flex flex-col items-center justify-center'>
        <FileX className='size-14 text-gray-500' />
        <p className='text-sm text-gray-500'>No data found</p>
      </div>
    </div>
  );
};

export default NoData;
