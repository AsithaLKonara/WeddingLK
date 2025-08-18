#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🧹 Clearing Next.js cache and build artifacts...')

try {
  // Remove .next directory
  const nextDir = path.join(process.cwd(), '.next')
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true })
    console.log('✅ Removed .next directory')
  }

  // Remove node_modules/.cache
  const cacheDir = path.join(process.cwd(), 'node_modules', '.cache')
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true })
    console.log('✅ Removed node_modules/.cache')
  }

  // Remove any remaining build artifacts
  const buildArtifacts = [
    '.next',
    'out',
    'dist',
    'build'
  ]

  buildArtifacts.forEach(artifact => {
    const artifactPath = path.join(process.cwd(), artifact)
    if (fs.existsSync(artifactPath)) {
      fs.rmSync(artifactPath, { recursive: true, force: true })
      console.log(`✅ Removed ${artifact} directory`)
    }
  })

  console.log('\n🎯 Cache cleared successfully!')
  console.log('\n📋 Next steps:')
  console.log('1. Stop the development server (Ctrl+C)')
  console.log('2. Run: npm run dev')
  console.log('3. The application should now work without duplicate content errors')
  
} catch (error) {
  console.error('❌ Error clearing cache:', error)
  process.exit(1)
} 