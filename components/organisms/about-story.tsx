'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function AboutStory() {
  return (
    <section className='py-20 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900'>
            Our Journey
          </h2>

          <div className='space-y-12'>
            <div className='flex flex-col md:flex-row gap-8 items-center'>
              <div className='flex-1'>
                <h3 className='text-2xl font-semibold mb-4 text-gray-800'>
                  The Beginning
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  WeddingLK was born from a simple idea: making wedding planning
                  accessible, transparent, and enjoyable for couples in Sri
                  Lanka. Our founders experienced the challenges of planning
                  their own weddings and decided to create a solution.
                </p>
              </div>
              <div className='flex-1 bg-gray-100 rounded-lg h-64 flex items-center justify-center'>
                <span className='text-gray-500'>Image Placeholder</span>
              </div>
            </div>

            <div className='flex flex-col md:flex-row-reverse gap-8 items-center'>
              <div className='flex-1'>
                <h3 className='text-2xl font-semibold mb-4 text-gray-800'>
                  Growth & Innovation
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Over the years, we've grown from a simple directory to a
                  comprehensive platform offering AI-powered recommendations,
                  real-time collaboration tools, and seamless vendor management.
                </p>
              </div>
              <div className='flex-1 bg-gray-100 rounded-lg h-64 flex items-center justify-center'>
                <span className='text-gray-500'>Image Placeholder</span>
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-8 items-center'>
              <div className='flex-1'>
                <h3 className='text-2xl font-semibold mb-4 text-gray-800'>
                  Today & Tomorrow
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  We continue to innovate, bringing cutting-edge technology to
                  the wedding industry while maintaining the personal touch that
                  makes every celebration special.
                </p>
              </div>
              <div className='flex-1 bg-gray-100 rounded-lg h-64 flex items-center justify-center'>
                <span className='text-gray-500'>Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutStory;
