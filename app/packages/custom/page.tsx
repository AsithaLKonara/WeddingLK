'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/templates/main-layout';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// input will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// label will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// input will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// input will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function CustomPackagePage() {
  const router = useRouter();
  const [budget, setBudget] = useState([500000]);
  const [selectedServices, setselectedServices] = useState<string[]>([]);

  const services = [
    { id: 'venue', name: 'Venue Rental', price: 200000, required: true },
    {
      id: 'photography',
      name: 'Photography & Videography',
      price: 150000,
      required: false,
    },
    {
      id: 'catering',
      name: 'Catering Services',
      price: 180000,
      required: false,
    },
    {
      id: 'decoration',
      name: 'Decoration & Flowers',
      price: 100000,
      required: false,
    },
    {
      id: 'entertainment',
      name: 'Entertainment (DJ/Band)',
      price: 80000,
      required: false,
    },
    { id: 'transport', name: 'Transportation', price: 50000, required: false },
    {
      id: 'coordinator',
      name: 'Wedding Coordinator',
      price: 75000,
      required: false,
    },
    {
      id: 'makeup',
      name: 'Bridal Makeup & Hair',
      price: 45000,
      required: false,
    },
  ];

  const handleServiceToggle = (serviceId: string) => {
    setselectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const totalCost = services
    .filter(
      service => service.required || selectedServices.includes(service.id)
    )
    .reduce((sum, service) => sum + service.price, 0);

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
              Create Custom Package
            </h1>
            <p className='text-gray-600 dark:text-gray-300 mt-2'>
              Build your perfect wedding package
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Package Builder */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Budget Range */}
              <div>
                <div>
                  <h3>Budget Range</h3>
                </div>
                <div>
                  <div className='space-y-4'>
                    <label>Budget: LKR {budget[0].toLocaleString()}</label>
                    <input
                      value={budget}
                      onValueChange={setBudget}
                      max={2000000}
                      min={200000}
                      step={50000}
                      className='w-full'
                    />
                    <div className='flex justify-between text-sm text-gray-500'>
                      <span>LKR 200,000</span>
                      <span>LKR 2,000,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <div>
                  <h3>Wedding Details</h3>
                </div>
                <div className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor='date'>Wedding Date</label>
                      <input type='date' id='date' />
                    </div>
                    <div>
                      <label htmlFor='guests'>Number of Guests</label>
                      <input type='number' id='guests' placeholder='150' />
                    </div>
                  </div>
                  <div>
                    <label htmlFor='location'>Preferred Location</label>
                    <input
                      id='location'
                      placeholder='Colombo, Western Province'
                    />
                  </div>
                </div>
              </div>

              {/* Services selection */}
              <div>
                <div>
                  <h3>select Services</h3>
                </div>
                <div className='space-y-4'>
                  {services.map(service => (
                    <div
                      key={service.id}
                      className='flex items-center justify-between p-4 border rounded-lg'
                    >
                      <div className='flex items-center space-x-3'>
                        <input
                          checked={
                            service.required ||
                            selectedServices.includes(service.id)
                          }
                          onCheckedChange={() =>
                            !service.required && handleServiceToggle(service.id)
                          }
                          disabled={service.required}
                        />
                        <div>
                          <div className='font-medium'>{service.name}</div>
                          {service.required && (
                            <div className='text-sm text-gray-500'>
                              Required
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-medium'>
                          LKR {service.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Package Summary */}
            <div className='lg:col-span-1'>
              <div className='sticky top-4'>
                <div>
                  <h3>Package Summary</h3>
                </div>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    {services
                      .filter(
                        service =>
                          service.required ||
                          selectedServices.includes(service.id)
                      )
                      .map(service => (
                        <div
                          key={service.id}
                          className='flex justify-between text-sm'
                        >
                          <span>{service.name}</span>
                          <span>LKR {service.price.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>

                  <div className='border-t pt-4'>
                    <div className='flex justify-between font-bold text-lg'>
                      <span>Total Cost</span>
                      <span>LKR {totalCost.toLocaleString()}</span>
                    </div>
                    {totalCost > budget[0] && (
                      <div className='text-red-500 text-sm mt-2'>
                        Over budget by LKR{' '}
                        {(totalCost - budget[0]).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className='space-y-2 pt-4'>
                    <button className='w-full'>Save Package</button>
                    <button className='px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
