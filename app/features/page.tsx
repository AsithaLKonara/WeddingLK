import { Metadata } from 'next';
import Link from 'next/link';
import {
  Calendar,
  Users,
  Phone,
  Eye,
  Download,
  Loader2,
  Heart,
  MessageSquare,
  CreditCard,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Bell,
  Settings,
  CheckSquare,
  MessageCircle,
  Store,
  Smartphone,
  Shield,
  Star,
  Camera,
  ArrowRight,
  Mail,
  Lock,
  EyeOff,
  XCircle,
  Clock,
  Play,
  Database,
  User,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features - WeddingLK',
  description:
    'Discover the powerful features that make WeddingLK the ultimate wedding planning platform.',
};

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Planning',
    description:
      'Intelligent recommendations and automated planning assistance',
    href: '/features/ai-enhancements',
    color: 'text-purple-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Full-featured mobile application for on-the-go planning',
    href: '/features/mobile-app',
    color: 'text-blue-600',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade security for your sensitive wedding data',
    href: '/features/security',
    color: 'text-green-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance for seamless user experience',
    href: '/features/performance',
    color: 'text-yellow-600',
  },
  {
    icon: Users,
    title: 'Collaborative Planning',
    description: 'Work together with family and vendors seamlessly',
    href: '/features/collaboration',
    color: 'text-pink-600',
  },
  {
    icon: Clock,
    title: 'Smart Scheduling',
    description: 'Intelligent timeline management and reminders',
    href: '/features/scheduling',
    color: 'text-indigo-600',
  },
  {
    icon: Heart,
    title: 'Personalized Experience',
    description: 'Tailored recommendations based on your preferences',
    href: '/features/personalization',
    color: 'text-red-600',
  },
];

export default function FeaturesPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50'>
      {/* Hero Section */}
      <section className='relative py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
            Powerful Features for
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600'>
              {' '}
              Perfect Weddings
            </span>
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
            Discover the comprehensive suite of tools and features that make
            WeddingLK the ultimate wedding planning platform.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-lg font-medium'>
              Start Planning
              <ArrowRight className='ml-2 h-5 w-5' />
            </button>
            <button className='px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50'>
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Everything You Need
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              From initial planning to the big day, WeddingLK provides all the
              tools you need for a seamless wedding experience.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'
              >
                <div className='p-6'>
                  <div className='mb-4'>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 mt-2'>
                      {feature.description}
                    </p>
                  </div>
                  <div className='space-y-3'>
                    <div className='flex items-start space-x-3'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                      <span className='text-sm text-gray-700 dark:text-gray-300'>
                        Easy to use interface
                      </span>
                    </div>
                    <div className='flex items-start space-x-3'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                      <span className='text-sm text-gray-700 dark:text-gray-300'>
                        Professional features
                      </span>
                    </div>
                    <div className='flex items-start space-x-3'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                      <span className='text-sm text-gray-700 dark:text-gray-300'>
                        24/7 support
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-500 to-purple-600'>
        <div className='max-w-4xl mx-auto text-center text-white'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Ready to Start Your Wedding Journey?
          </h2>
          <p className='text-xl mb-8 opacity-90'>
            Join thousands of couples who have successfully planned their dream
            weddings with WeddingLK.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='px-6 py-3 bg-white text-rose-600 hover:bg-gray-100 rounded-lg font-medium'>
              Get Started Free
            </button>
            <button className='px-6 py-3 border border-white text-white hover:bg-white hover:text-rose-600 rounded-lg font-medium'>
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
