"use client"

import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Suspense, useState, useEffect } from "react"

// Loading component for Suspense
function VerifyEmailLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verifying email...</p>
      </div>
    </div>
  )
}

// Main verify email component
function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setVerificationStatus('error')
        setErrorMessage('Invalid verification link')
        return
      }

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock verification result
        const isSuccess = Math.random() > 0.3 // 70% success rate for demo
        
        if (isSuccess) {
          setVerificationStatus('success')
        } else {
          setVerificationStatus('error')
          setErrorMessage('Verification failed. Please try again.')
        }
      } catch (error) {
        setVerificationStatus('error')
        setErrorMessage('An error occurred during verification')
      }
    }

    verifyEmail()
  }, [token, email])

  if (verificationStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h1>
          <p className="text-gray-600">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    )
  }

  if (verificationStatus === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your email address has been verified. You can now access all features of WeddingLK.
          </p>
          <div className="space-y-4">
            <Link href="/dashboard" className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium">
              Go to Dashboard
            </Link>
            <Link href="/" className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
        <p className="text-gray-600 mb-6">
          {errorMessage || 'Unable to verify your email address. Please try again.'}
        </p>
        <div className="space-y-4">
          <Link href="/login" className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium">
            Try Again
          </Link>
          <Link href="/contact" className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

// Main export with Suspense wrapper
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  )
} 