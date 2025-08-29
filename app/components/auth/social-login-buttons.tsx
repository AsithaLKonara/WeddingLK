'use client';

export function SocialLoginButtons() {
  return (
    <div className='space-y-4'>
      <button className='w-full flex items-center justify-center space-x-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
        <div className='w-5 h-5'>🔍</div>
        <span className='text-gray-700 dark:text-gray-300'>
          Continue with Google
        </span>
      </button>
      <button className='w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors'>
        <div className='w-5 h-5'>📘</div>
        <span>Continue with Facebook</span>
      </button>
    </div>
  );
}
