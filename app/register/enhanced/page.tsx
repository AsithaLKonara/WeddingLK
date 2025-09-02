'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  Circle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  XCircle,
} from 'lucide-react';
import { RoleSelection } from '@/components/auth/role-selection';
import { EnhancedRegistrationForm } from '@/components/auth/enhanced-registration-form';
import { DocumentUpload } from '@/components/auth/document-upload';
import { RegistrationProgress } from '../../../components/auth/registration-progress';
import { SocialLoginButtons } from '../../../components/auth/social-login-buttons';
import { DynamicFormFactory } from '@/lib/forms/dynamic-form-engine';

interface RegistrationData {
  [_key: string]: any;
}

interface RegistrationStep {
  _id: string;
  _title: string;
  _description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  _required: boolean;
  _estimatedTime: number;
}

function EnhancedRegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setselectedRole] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<RegistrationData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get role from URL params or default to empty
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (
      roleParam &&
      ['user', 'vendor', 'wedding_planner'].includes(roleParam)
    ) {
      setselectedRole(roleParam);
    }
  }, [searchParams]);

  // Define registration steps
  const registrationSteps = useMemo<RegistrationStep[]>(
    () => [
      {
        id: 'role_selection',
        title: 'Choose Your Role',
        description: 'select how you want to use WeddingLK',
        status: 'pending',
        required: true,
        estimatedTime: 1,
      },
      {
        id: 'basic_info',
        title: 'Basic Information',
        description: 'Enter your personal details and contact information',
        status: 'pending',
        required: true,
        estimatedTime: 5,
      },
      {
        id: 'role_specific',
        title: 'Role-Specific Details',
        description: 'Provide information specific to your selected role',
        status: 'pending',
        required: true,
        estimatedTime: 10,
      },
      {
        id: 'documents',
        title: 'Document Verification',
        description: 'Upload required documents for verification',
        status: 'pending',
        required:
          selectedRole === 'vendor' || selectedRole === 'wedding_planner',
        estimatedTime: 15,
      },
      {
        id: 'review',
        title: 'Review & Submit',
        description: 'Review your information and complete registration',
        status: 'pending',
        required: true,
        estimatedTime: 3,
      },
    ],
    [selectedRole]
  );

  // Update step status based on current progress
  useEffect(() => {
    const updatedSteps = registrationSteps.map((step, index) => {
      if (index < currentStep) {
        return { ...step, status: 'completed' as const };
      } else if (index === currentStep) {
        return { ...step, status: 'in_progress' as const };
      } else {
        return { ...step, status: 'pending' as const };
      }
    });
    // Note: In a real implementation, you'd update the steps state here
  }, [currentStep, selectedRole, registrationSteps]);

  const handleRoleselection = (_role: string) => {
    setselectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    setCurrentStep(1); // Move to next step
  };

  const handleFormDataUpdate = (data: RegistrationData) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleStepNavigation = (_stepIndex: number) => {
    // Validate current step before allowing navigation
    if (stepIndex > currentStep && !canProceedToStep(stepIndex)) {
      setError('Please complete the current step before proceeding');
      return;
    }
    setCurrentStep(stepIndex);
    setError(null);
  };

  const canProceedToStep = (_stepIndex: number): boolean => {
    switch (stepIndex) {
      case 1: // Basic info
        return !!selectedRole;
      case 2: // Role-specific
        return !!formData.name && !!formData.email;
      case 3: // Documents
        return !!formData.businessName || !!formData.companyName;
      case 4: // Review
        return isCurrentStepComplete();
      default:
        return true;
    }
  };

  const isCurrentStepComplete = (): boolean => {
    switch (currentStep) {
      case 0: // Role selection
        return !!selectedRole;
      case 1: // Basic info
        return !!(formData.name && formData.email && formData.password);
      case 2: // Role-specific
        if (selectedRole === 'vendor') {
          return !!(formData.businessName && formData.category);
        } else if (selectedRole === 'wedding_planner') {
          return !!(formData.companyName && formData.experienceYears);
        }
        return true;
      case 3: // Documents
        return true; // Documents are optional for completion
      default:
        return true;
    }
  };

  const handleSaveProgress = async () => {
    try {
      const progressData = {
        role: selectedRole,
        formData,
        currentStep,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(
        `registration_progress_${selectedRole}`,
        JSON.stringify(progressData)
      );
      setSuccess('Progress saved successfully!');

      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to save progress');
    }
  };

  const handleSubmit = async () => {
    if (!isCurrentStepComplete()) {
      setError('Please complete all required fields before submitting');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Submit registration data
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const result = await response.json();
      setSuccess('Registration successful! Redirecting to dashboard...');

      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (): number => {
    const completedSteps = registrationSteps
      .slice(0, currentStep + 1)
      .filter(step => step.status === 'completed').length;

    return (completedSteps / registrationSteps.length) * 100;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Choose Your Role
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                Select how you want to use WeddingLK. This will determine the
                features available to you.
              </p>
            </div>
            <div className='space-y-6'>
              <RoleSelection onRoleSelect={handleRoleselection} />
            </div>
          </div>
        );

      case 1:
        return (
          <EnhancedRegistrationForm
            role={selectedRole}
            onSuccess={handleFormDataUpdate}
            onError={setError}
          />
        );

      case 2:
        return (
          <div>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Additional Information
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                Provide additional details specific to your role as a{' '}
                {selectedRole.replace('_', ' ')}.
              </p>
            </div>
            <div className='space-y-6'>
              <EnhancedRegistrationForm
                role={selectedRole}
                onSuccess={handleFormDataUpdate}
                onError={setError}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Document Verification
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                Upload required documents to verify your identity and
                qualifications.
              </p>
            </div>
            <div className='space-y-6'>
              <div className='space-y-6'>
                {selectedRole === 'vendor' && (
                  <DocumentUpload
                    documentType='business_license'
                    onUpload={async file => {
                      // Handle file upload
                      console.log('Uploading business license:', file);
                    }}
                    onRemove={fileId => {
                      // Handle file removal
                      console.log('Removing file:', fileId);
                    }}
                    maxFileSize={10 * 1024 * 1024} // 10MB
                    allowedTypes={[
                      'application/pdf',
                      'image/jpeg',
                      'image/png',
                    ]}
                    required={true}
                  />
                )}

                {selectedRole === 'wedding_planner' && (
                  <DocumentUpload
                    documentType='professional_certification'
                    onUpload={async file => {
                      // Handle file upload
                      console.log('Uploading certification:', file);
                    }}
                    onRemove={fileId => {
                      // Handle file removal
                      console.log('Removing file:', fileId);
                    }}
                    maxFileSize={10 * 1024 * 1024} // 10MB
                    allowedTypes={[
                      'application/pdf',
                      'image/jpeg',
                      'image/png',
                    ]}
                    required={false}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Review & Submit
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                Review your information before completing registration.
              </p>
            </div>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {Object.entries(formData).map(([key, value]) => {
                  if (typeof value === 'object' && value !== null) return null;
                  if (value === undefined || value === '') return null;

                  return (
                    <div
                      key={key}
                      className='flex justify-between p-2 bg-gray-50 rounded'
                    >
                      <span className='font-medium capitalize'>
                        {key.replace(/([A-Z])/g, ' $1')}:
                      </span>
                      <span className='text-gray-600'>{String(value)}</span>
                    </div>
                  );
                })}
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
                >
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Back
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !isCurrentStepComplete()}
                  className='flex-1'
                >
                  {loading ? (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <CheckCircle className='w-4 h-4 mr-2' />
                  )}
                  Complete Registration
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Create Your WeddingLK Account
          </h1>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Join thousands of couples, vendors, and wedding planners who trust
            WeddingLK for their wedding needs.
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className='mb-6 border-red-200 bg-red-50 p-4 rounded-lg flex items-start space-x-3'>
            <XCircle className='w-4 h-4 text-red-600 mt-0.5' />
            <p className='text-red-800'>{error}</p>
          </div>
        )}

        {success && (
          <div className='mb-6 border-green-200 bg-green-50 p-4 rounded-lg flex items-start space-x-3'>
            <CheckCircle className='w-4 h-4 text-green-600 mt-0.5' />
            <p className='text-green-800'>{success}</p>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>{renderCurrentStep()}</div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Progress Tracking */}
            <RegistrationProgress
              steps={registrationSteps}
              currentStep={currentStep}
              onStepClick={handleStepNavigation}
              onSaveProgress={handleSaveProgress}
              totalProgress={calculateProgress()}
            />

            {/* Social Login */}
            <div>
              <div className='mb-4'>
                <h3 className='text-sm font-medium text-gray-900'>
                  Quick Sign Up
                </h3>
                <p className='text-xs text-gray-600'>
                  Already have an account? Sign in with social media
                </p>
              </div>
              <div className='space-y-3'>
                <SocialLoginButtons
                  onSuccess={() => router.push('/dashboard')}
                  onError={setError}
                  showDescription={false}
                />
              </div>
            </div>

            {/* Help & Support */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='mb-3'>
                <h3 className='text-sm font-medium text-blue-800'>
                  Need Help?
                </h3>
              </div>
              <div className='space-y-3'>
                <p className='text-xs text-blue-700'>
                  Our support team is here to help you complete your
                  registration.
                </p>
                <button className='w-full bg-white border border-blue-300 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-50'>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedRegistrationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnhancedRegistrationContent />
    </Suspense>
  );
}
