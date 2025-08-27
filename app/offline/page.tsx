'use client';

import React from 'react';
import { Wifi, WifiOff, RefreshCw, Home } from 'lucide-react';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            You're Offline
          </h1>
        </div>
        
        <div className="space-y-6">
          <div className="mx-auto mb-4">
            <div className="relative">
              <WifiOff className="h-16 w-16 text-red-500 mx-auto" />
              <Wifi className="h-8 w-8 text-gray-400 absolute -top-2 -right-2" />
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            It looks like you've lost your internet connection. Don't worry! 
            Some features of WeddingLK are available offline.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Available Offline:</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• View cached pages</li>
              <li>• Access saved information</li>
              <li>• Use planning tools</li>
              <li>• View saved vendors & venues</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            
            <button 
              onClick={handleGoHome}
              className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </button>
          </div>
          
          <p className="text-xs text-gray-500">
            Check your internet connection and try again
          </p>
        </div>
      </div>
    </div>
  );
} 