'use client';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      {/* Hero Section */}
      <section className='py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center'
          >
            <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-6'>
              About WeddingLK
            </h1>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              Your premier destination for wedding planning in Sri Lanka. We
              connect couples with the best vendors, venues, and services to
              create unforgettable wedding experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='py-20 bg-white dark:bg-gray-900'
      >
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
              Our Story
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
              WeddingLK was born from a simple idea: making wedding planning
              accessible, enjoyable, and stress-free for couples across Sri
              Lanka. We understand that every wedding is unique, and we're here
              to help you bring your vision to life.
            </p>
            <p className='text-lg text-gray-600 dark:text-gray-300'>
              From intimate ceremonies to grand celebrations, our platform
              connects you with trusted vendors, beautiful venues, and
              professional services that match your style and budget.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='py-20 bg-gray-50 dark:bg-gray-800'
      >
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <h3 className='text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                500+
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>Happy Couples</p>
            </div>
            <div>
              <h3 className='text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                200+
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Trusted Vendors
              </p>
            </div>
            <div>
              <h3 className='text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                50+
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Beautiful Venues
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className='py-20 bg-white dark:bg-gray-900'
      >
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              Meet Our Team
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-300'>
              Dedicated professionals committed to making your wedding dreams
              come true
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4'></div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Wedding Planners
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Expert coordination and planning
              </p>
            </div>
            <div className='text-center'>
              <div className='w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4'></div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Vendor Network
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Curated selection of professionals
              </p>
            </div>
            <div className='text-center'>
              <div className='w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4'></div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Support Team
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                24/7 assistance and guidance
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
