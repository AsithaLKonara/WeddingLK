'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js Error:', error);

    if (process.env.NODE_ENV === 'production') {
      // Send to monitoring service (e.g., Sentry)
      // captureException(error);
    }
  }, [error]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center'>
        <div className='flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4'>
          <svg
            className='w-8 h-8 text-red-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>

        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Something went wrong!
        </h1>

        <p className='text-gray-600 mb-6'>
          We encountered an unexpected error. Please try again or contact
          support if the problem persists.
        </p>

        <div className='space-y-3'>
          <Button
            onClick={reset}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white'
          >
            Try again
          </Button>

          <Button
            onClick={() => (window.location.href = '/')}
            variant='outline'
            className='w-full'
          >
            Go to Homepage
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className='mt-6 text-left'>
            <summary className='cursor-pointer text-sm text-gray-600 font-medium'>
              Error Details (Development)
            </summary>
            <div className='mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto'>
              <div className='mb-2'>
                <strong>Error:</strong> {error.message}
              </div>
              {error.digest && (
                <div className='mb-2'>
                  <strong>Digest:</strong> {error.digest}
                </div>
              )}
              <div>
                <strong>Stack:</strong>
                <pre className='mt-1 text-red-600 whitespace-pre-wrap'>
                  {error.stack}
                </pre>
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
