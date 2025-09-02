'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoleSelection } from '@/components/auth/role-selection';
import { DynamicRegistrationForm } from '@/components/auth/dynamic-registration-form';
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
} from 'lucide-react';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<
    'role-selection' | 'registration' | 'success' | 'error'
  >('role-selection');
  const [selectedRole, setselectedRole] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleRoleselect = (_role: string) => {
    setselectedRole(role);
    setCurrentStep('registration');
  };

  const handleBackToRoleselection = () => {
    setCurrentStep('role-selection');
    setselectedRole('');
  };

  const handleRegistrationSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setCurrentStep('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
        setCurrentStep('error');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setCurrentStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'role-selection':
        return <RoleSelection onRoleSelect={handleRoleselect} />;

      case 'registration':
        return (
          <DynamicRegistrationForm
            role={selectedRole}
            onSubmit={handleRegistrationSubmit}
            onBack={handleBackToRoleselection}
          />
        );

      case 'success':
        return (
          <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4'>
            <div className='max-w-md w-full text-center shadow-xl'>
              <div className='p-6'>
                <div className='w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center'>
                  <CheckCircle className='w-8 h-8 text-green-600' />
                </div>
                <h2 className='text-2xl font-bold text-green-900 mb-4'>
                  Registration Successful!
                </h2>
                <p className='text-green-700'>
                  Welcome to WeddingLK! Your account has been created
                  successfully.
                </p>
                <p className='text-sm text-green-600'>
                  Please check your email for verification instructions.
                </p>
                <div className='pt-4'>
                  <button
                    onClick={() => router.push('/login')}
                    className='w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg'
                  >
                    Continue to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className='min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center px-4'>
            <div className='max-w-md w-full text-center shadow-xl'>
              <div className='p-6'>
                <div className='w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center'>
                  <XCircle className='w-8 h-8 text-red-600' />
                </div>
                <h2 className='text-2xl font-bold text-red-900 mb-4'>
                  Registration Failed
                </h2>
                <p className='text-red-700'>
                  {error ||
                    'An error occurred during registration. Please try again.'}
                </p>
                <div className='flex gap-3 pt-4'>
                  <button
                    onClick={handleBackToRoleselection}
                    className='flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50'
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className='flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg'
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen'>
      {renderContent()}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='p-8 text-center'>
            <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4 text-primary' />
            <p className='text-lg font-medium'>Creating your account...</p>
            <p className='text-sm text-gray-600 mt-2'>
              Please wait while we set up your profile
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
