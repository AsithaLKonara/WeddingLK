'use client';

import { useState } from 'react';

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
      <div className='border-b border-gray-200 dark:border-gray-700'>
        <nav className='flex space-x-8 px-6'>
          {[
            { id: 'personal', label: 'Personal Info' },
            { id: 'security', label: 'Security' },
            { id: 'preferences', label: 'Preferences' },
            { id: 'notifications', label: 'Notifications' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className='p-6'>
        {activeTab === 'personal' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Personal Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  First Name
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                  placeholder='Enter first name'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Last Name
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                  placeholder='Enter last name'
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Security Settings
            </h3>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>
              Change Password
            </button>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Preferences
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>
              Customize your experience
            </p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Notification Settings
            </h3>
            <p className='text-gray-600 dark:text-gray-300'>
              Manage your notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

