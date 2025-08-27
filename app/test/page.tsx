"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Testimonialdiv } from '@/components/molecules/testimonial-card'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'pending'
  message: string
  details?: any
}

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Page Working!</h1>
        <p className="text-gray-600">If you can see this, Next.js is working</p>
        <div className="mt-8 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800">✅ Frontend is loading correctly</p>
        </div>
      </div>
    </div>
  )
}
