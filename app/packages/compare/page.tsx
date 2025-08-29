'use client';

import React from 'react';
import { MainLayout } from '@/components/templates/main-layout';

import { Check, X, Star, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PackageFeatures {
  [key: string]: boolean;
}

interface Package {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  rating: number;
  features: PackageFeatures;
}

export default function ComparePackagesPage() {
  const router = useRouter();

  const packages: Package[] = [
    {
      id: 1,
      title: 'Premium Elite Package',
      price: 850000,
      originalPrice: 1200000,
      rating: 4.9,
      features: {
        '5-star luxury venue': true,
        'Award-winning photographer': true,
        'Premium catering': true,
        'Live band & DJ': true,
        'Bridal suite': true,
        'Wedding coordinator': true,
        Transportation: true,
        'Honeymoon package': true,
        'Video coverage': true,
        'Decoration premium': true,
      },
    },
    {
      id: 2,
      title: 'Luxury Complete Package',
      price: 650000,
      originalPrice: 900000,
      rating: 4.7,
      features: {
        '5-star luxury venue': false,
        'Award-winning photographer': true,
        'Premium catering': true,
        'Live band & DJ': false,
        'Bridal suite': true,
        'Wedding coordinator': true,
        Transportation: false,
        'Honeymoon package': false,
        'Video coverage': true,
        'Decoration premium': false,
      },
    },
    {
      id: 3,
      title: 'Essential Wedding Package',
      price: 450000,
      originalPrice: 650000,
      rating: 4.5,
      features: {
        '5-star luxury venue': false,
        'Award-winning photographer': false,
        'Premium catering': false,
        'Live band & DJ': false,
        'Bridal suite': false,
        'Wedding coordinator': true,
        Transportation: false,
        'Honeymoon package': false,
        'Video coverage': false,
        'Decoration premium': false,
      },
    },
  ];

  const allFeatures = Object.keys(packages[0].features);

  return (
    <MainLayout>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-8'>
            <button
              className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-4'
              onClick={() => router.back()}
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </button>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Compare Wedding Packages
            </h1>
            <p className='text-gray-600 dark:text-gray-300 mt-2'>
              Find the perfect package for your special day
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Features Column */}
            <div className='lg:col-span-1'>
              <div className='sticky top-4'>
                <div>
                  <h3>Features</h3>
                </div>
                <div className='space-y-4'>
                  {allFeatures.map(feature => (
                    <div
                      key={feature}
                      className='text-sm font-medium text-gray-700 dark:text-gray-300 py-2'
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Package Columns */}
            {packages.map(pkg => (
              <div key={pkg.id} className='lg:col-span-1'>
                <div className='h-full'>
                  <div className='text-center'>
                    <h3 className='text-lg'>{pkg.title}</h3>
                    <div className='flex items-center justify-center space-x-1 mb-2'>
                      <Star className='h-4 w-4 text-yellow-400 fill-current' />
                      <span className='font-medium'>{pkg.rating}</span>
                    </div>
                    <div className='space-y-1'>
                      <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                        LKR {pkg.price.toLocaleString()}
                      </div>
                      <div className='text-sm text-gray-500 line-through'>
                        LKR {pkg.originalPrice.toLocaleString()}
                      </div>
                      <span className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                        Save{' '}
                        {Math.round(
                          ((pkg.originalPrice - pkg.price) /
                            pkg.originalPrice) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    {allFeatures.map(feature => (
                      <div
                        key={feature}
                        className='flex items-center justify-center py-2'
                      >
                        {pkg.features[feature] ? (
                          <Check className='h-5 w-5 text-green-500' />
                        ) : (
                          <X className='h-5 w-5 text-gray-300' />
                        )}
                      </div>
                    ))}
                    <button
                      className='w-full mt-4'
                      onClick={() => router.push(`/packages/${pkg.id}/book`)}
                    >
                      select Package
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
