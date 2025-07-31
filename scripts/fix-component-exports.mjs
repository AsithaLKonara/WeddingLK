#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.join(__dirname, '..', 'components')

function hasDefaultExport(content) {
  return content.includes('export default') || content.includes('export { default }')
}

function addDefaultExport(content, componentName) {
  // If already has default export, return as is
  if (hasDefaultExport(content)) {
    return content
  }

  // Find the main component function/const
  const lines = content.split('\n')
  let componentLine = -1
  let componentNameFound = ''

  // Look for function or const declarations
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('export function') || line.startsWith('export const')) {
      const match = line.match(/export\s+(?:function|const)\s+(\w+)/)
      if (match) {
        componentLine = i
        componentNameFound = match[1]
        break
      }
    }
  }

  if (componentLine === -1) {
    console.log(`⚠️  Could not find component in ${componentName}`)
    return content
  }

  // Add default export at the end
  const newContent = content + `\n\nexport default ${componentNameFound}\n`
  return newContent
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const fileName = path.basename(filePath, path.extname(filePath))
    
    if (!hasDefaultExport(content)) {
      const newContent = addDefaultExport(content, fileName)
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent)
        console.log(`✅ Fixed: ${filePath}`)
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      walkDir(filePath)
    } else if (file.endsWith('.tsx') && !file.endsWith('.test.tsx')) {
      processFile(filePath)
    }
  }
}

console.log('🔧 Fixing component export issues...')
walkDir(componentsDir)
console.log('✅ Component export fixes completed!') 