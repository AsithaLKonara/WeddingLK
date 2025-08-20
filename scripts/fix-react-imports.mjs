#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.join(__dirname, '..', 'components')

function hasReactImport(content) {
  return content.includes('import React') || content.includes('import { useState }')
}

function addReactImport(content) {
  // If already has React import, return as is
  if (hasReactImport(content)) {
    return content
  }

  // Find the first import statement
  const lines = content.split('\n')
  let firstImportIndex = -1

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      firstImportIndex = i
      break
    }
  }

  if (firstImportIndex === -1) {
    // No imports found, add React import at the beginning
    return `import React from "react"\n${content}`
  }

  // Add React import before the first import
  lines.splice(firstImportIndex, 0, 'import React from "react"')
  return lines.join('\n')
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // Check if file uses useState but doesn't import React
    if (content.includes('useState') && !content.includes('import React') && content.includes('"use client"')) {
      const updatedContent = addReactImport(content)
      if (updatedContent !== content) {
        fs.writeFileSync(filePath, updatedContent)
        console.log(`Fixed: ${filePath}`)
        return true
      }
    }
    return false
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return false
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  let fixedCount = 0

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      fixedCount += walkDir(filePath)
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (processFile(filePath)) {
        fixedCount++
      }
    }
  }

  return fixedCount
}

console.log('Fixing React imports in components...')
const fixedCount = walkDir(componentsDir)
console.log(`Fixed ${fixedCount} files`) 