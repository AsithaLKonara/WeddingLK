'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AboutHero() {
  return (
    <section className='relative bg-gradient-to-br from-pink-50 to-purple-50 py-20'>
      <div className='container mx-auto px-4'>
        <div className='text-center max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
            About WeddingLK
          </h1>
          <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
            We're revolutionizing the wedding planning experience in Sri Lanka,
            connecting couples with the best vendors and venues to create
            unforgettable celebrations.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' className='bg-pink-600 hover:bg-pink-700'>
              Our Story
            </Button>
            <Button size='lg' variant='outline'>
              Meet the Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutHero;
