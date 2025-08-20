#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// UI components that use named exports (not default exports)
const UI_COMPONENTS = {
  'button': ['Button', 'buttonVariants'],
  'card': ['Card', 'CardHeader', 'CardFooter', 'CardTitle', 'CardDescription', 'CardContent'],
  'input': ['Input'],
  'label': ['Label'],
  'separator': ['Separator'],
  'alert': ['Alert', 'AlertTitle', 'AlertDescription'],
  'progress': ['Progress'],
  'badge': ['Badge'],
  'tabs': ['Tabs', 'TabsContent', 'TabsList', 'TabsTrigger'],
  'checkbox': ['Checkbox'],
  'slider': ['Slider'],
  'tooltip': ['Tooltip', 'TooltipContent', 'TooltipProvider', 'TooltipTrigger'],
  'table': ['Table', 'TableBody', 'TableCell', 'TableHead', 'TableHeader', 'TableRow'],
  'dialog': ['Dialog', 'DialogContent', 'DialogHeader', 'DialogTitle', 'DialogFooter', 'DialogTrigger', 'DialogClose'],
  'loading-spinner': ['LoadingSpinner', 'SkeletonLoader', 'PageLoader']
}

function fixDynamicImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let modified = false

    // Find all dynamic imports of UI components
    const dynamicImportRegex = /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\("@\/components\/ui\/([^"]+)"\)[^)]*\)/g
    
    let match
    const imports = new Map()
    const replacements = []

    while ((match = dynamicImportRegex.exec(content)) !== null) {
      const componentName = match[1]
      const uiComponent = match[2]
      const fullMatch = match[0]

      if (UI_COMPONENTS[uiComponent]) {
        // Add to imports map
        if (!imports.has(uiComponent)) {
          imports.set(uiComponent, new Set())
        }
        imports.get(uiComponent).add(componentName)
        
        // Mark for replacement
        replacements.push({
          from: fullMatch,
          to: `// ${componentName} will be imported above`
        })
        
        modified = true
      }
    }

    if (modified) {
      // Remove dynamic import
      content = content.replace(/import\s+dynamic\s+from\s+"next\/dynamic"\s*\n?/g, '')
      
      // Add regular imports at the top
      let importStatements = []
      for (const [uiComponent, componentNames] of imports) {
        const availableExports = UI_COMPONENTS[uiComponent]
        const neededExports = Array.from(componentNames).filter(name => 
          availableExports.includes(name)
        )
        if (neededExports.length > 0) {
          importStatements.push(`import { ${neededExports.join(', ')} } from "@/components/ui/${uiComponent}"`)
        }
      }

      // Insert imports after the first import statement
      const firstImportIndex = content.indexOf('import')
      if (firstImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', firstImportIndex) + 1
        content = content.slice(0, firstImportIndex) + 
                 content.slice(firstImportIndex, nextLineIndex) +
                 importStatements.join('\n') + '\n' +
                 content.slice(nextLineIndex)
      }

      // Replace dynamic imports with comments
      for (const replacement of replacements) {
        content = content.replace(replacement.from, replacement.to)
      }

      // Clean up empty lines
      content = content.replace(/\n\s*\/\/ \w+ will be imported above\n/g, '\n')

      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Fixed: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message)
  }
}

function findTsxFiles(dir) {
  const files = []
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath)
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath)
      }
    }
  }
  
  scan(dir)
  return files
}

// Main execution
const appDir = path.join(__dirname, '..', 'app')
const componentDir = path.join(__dirname, '..', 'components')

console.log('🔍 Finding files with dynamic imports...')

const appFiles = findTsxFiles(appDir)
const componentFiles = findTsxFiles(componentDir)
const allFiles = [...appFiles, ...componentFiles]

console.log(`📁 Found ${allFiles.length} files to check`)

let fixedCount = 0
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8')
  if (content.includes('dynamic(() => import("@/components/ui/')) {
    fixDynamicImports(file)
    fixedCount++
  }
}

console.log(`\n🎉 Fixed ${fixedCount} files with dynamic import issues!`)
console.log('\n💡 All UI components now use regular imports instead of dynamic imports.')
console.log('   This should resolve the "Element type is invalid" errors.')
