'use client';

import React from 'react';
import { useState } from 'react';
import { MainLayout } from '@/components/templates/main-layout';
import { motion } from 'framer-motion';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVenue, setSelectedVenue] = useState('all');

  return (
    <MainLayout>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='bg-white dark:bg-gray-800 border-b'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                Wedding Gallery
              </h1>
              <p className='text-lg text-gray-600 dark:text-gray-300'>
                Get inspired by beautiful weddings from our venues and vendors
              </p>
            </motion.div>
          </div>
        </div>

        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Gallery Filters</h2>
              <p className='text-gray-600 dark:text-gray-300'>Gallery filters will be loaded here</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='mt-8'
          >
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Photo Grid</h2>
              <p className='text-gray-600 dark:text-gray-300'>Photo grid will be loaded here</p>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}