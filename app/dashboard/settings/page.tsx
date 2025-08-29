'use client';

import { useState } from 'react';
import { User, Bell, Shield, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Settings
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings div */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
          <div className='border-b border-gray-200 dark:border-gray-700'>
            <nav className='flex space-x-8 px-6'>
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'billing', label: 'Billing', icon: CreditCard },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {activeTab === 'profile' && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Profile Settings
                </h2>
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
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Email
                    </label>
                    <input
                      type='email'
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                      placeholder='Enter email address'
                    />
                  </div>
                </div>
                <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Notification Preferences
                </h2>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                        Email Notifications
                      </h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Receive email updates about your account
                      </p>
                    </div>
                    <input
                      type='checkbox'
                      className='h-4 w-4 text-blue-600 rounded'
                      defaultChecked
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                        Push Notifications
                      </h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <input
                      type='checkbox'
                      className='h-4 w-4 text-blue-600 rounded'
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Security Settings
                </h2>
                <div className='space-y-4'>
                  <button className='w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg'>
                    Change Password
                  </button>
                  <button className='w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg'>
                    Enable Two-Factor Authentication
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Billing Information
                </h2>
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Current Plan:{' '}
                    <span className='font-semibold'>Free Plan</span>
                  </p>
                  <p className='text-gray-600 dark:text-gray-300 mt-2'>
                    Upgrade to unlock premium features and remove limitations.
                  </p>
                  <button className='mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>
                    Upgrade Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
