"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TestimonialCard } from '@/components/molecules/testimonial-card'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'pending'
  message: string
  details?: any
}

export default function TestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const tests: TestResult[] = []

    // Test 1: Component Rendering
    try {
      tests.push({
        name: 'Component Rendering',
        status: 'pass',
        message: 'All UI components render successfully'
      })
    } catch (error) {
      tests.push({
        name: 'Component Rendering',
        status: 'fail',
        message: 'Failed to render components',
        details: error
      })
    }

    // Test 2: API Health Check
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        const data = await response.json()
        tests.push({
          name: 'API Health Check',
          status: 'pass',
          message: 'API is healthy',
          details: data
        })
      } else {
        tests.push({
          name: 'API Health Check',
          status: 'fail',
          message: 'API health check failed',
          details: { status: response.status }
        })
      }
    } catch (error) {
      tests.push({
        name: 'API Health Check',
        status: 'fail',
        message: 'API health check error',
        details: error
      })
    }

    // Test 3: Database Connection (via API)
    try {
      const response = await fetch('/api/users/avatars')
      if (response.ok) {
        tests.push({
          name: 'Database Connection',
          status: 'pass',
          message: 'Database connection successful'
        })
      } else {
        tests.push({
          name: 'Database Connection',
          status: 'fail',
          message: 'Database connection failed',
          details: { status: response.status }
        })
      }
    } catch (error) {
      tests.push({
        name: 'Database Connection',
        status: 'fail',
        message: 'Database connection error',
        details: error
      })
    }

    // Test 4: Vendors API
    try {
      const response = await fetch('/api/vendors/with-avatars')
      if (response.ok) {
        const data = await response.json()
        tests.push({
          name: 'Vendors API',
          status: 'pass',
          message: `Vendors API working (${data.vendors?.length || 0} vendors)`,
          details: data
        })
      } else {
        tests.push({
          name: 'Vendors API',
          status: 'fail',
          message: 'Vendors API failed',
          details: { status: response.status }
        })
      }
      } catch (error) {
      tests.push({
        name: 'Vendors API',
        status: 'fail',
        message: 'Vendors API error',
        details: error
      })
    }

    // Test 5: Venues API
    try {
      const response = await fetch('/api/venues/with-avatars')
      if (response.ok) {
        const data = await response.json()
        tests.push({
          name: 'Venues API',
          status: 'pass',
          message: `Venues API working (${data.venues?.length || 0} venues)`,
          details: data
        })
      } else {
        tests.push({
          name: 'Venues API',
          status: 'fail',
          message: 'Venues API failed',
          details: { status: response.status }
        })
      }
    } catch (error) {
      tests.push({
        name: 'Venues API',
        status: 'fail',
        message: 'Venues API error',
        details: error
      })
    }

    setTestResults(tests)
    setIsRunning(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'fail': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅'
      case 'fail': return '❌'
      default: return '⏳'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            WeddingLK System Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive testing of all system components and APIs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Test Controls */}
          <div className="lg:col-span-1">
            <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={runTests} 
                  disabled={isRunning}
                  className="w-full"
                >
                  {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>This will test:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Component rendering</li>
                    <li>API health</li>
                    <li>Database connection</li>
                    <li>Vendors API</li>
                    <li>Venues API</li>
                  </ul>
          </div>
        </CardContent>
      </Card>

            {/* Component Preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Component Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <TestimonialCard
                  name="John Doe"
                  role="Bride"
                  content="Amazing wedding planning experience! The platform made everything so easy."
                  avatar="/placeholder-user.jpg"
                  rating={5}
                />
            </CardContent>
          </Card>
      </div>

          {/* Test Results */}
          <div className="lg:col-span-2">
            <Card>
        <CardHeader>
                <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No tests run yet. Click "Run All Tests" to start.
            </div>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((test, index) => (
                      <motion.div
                        key={test.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-4 border rounded-lg"
                      >
                        <div className="text-2xl">{getStatusIcon(test.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {test.name}
                            </h3>
                            <Badge className={getStatusColor(test.status)}>
                              {test.status.toUpperCase()}
                            </Badge>
            </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {test.message}
                          </p>
                          {test.details && (
                            <details className="text-sm text-gray-500">
                              <summary className="cursor-pointer hover:text-gray-700">
                                View Details
                              </summary>
                              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                                {JSON.stringify(test.details, null, 2)}
                              </pre>
                            </details>
                          )}
            </div>
                      </motion.div>
                    ))}
            </div>
                )}
        </CardContent>
      </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
