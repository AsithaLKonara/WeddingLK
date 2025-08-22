#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 WeddingLK Performance Optimizer');
console.log('==================================\n');

// Check for common performance issues
const issues = [];

// 1. Check for missing route files
const missingRoutes = [
  'app/features/page.tsx',
  'app/dashboard/user/page.tsx'
];

console.log('🔍 Checking for missing routes...');
missingRoutes.forEach(route => {
  if (!fs.existsSync(route)) {
    issues.push(`❌ Missing route: ${route}`);
    console.log(`   Missing: ${route}`);
  } else {
    console.log(`   ✅ Found: ${route}`);
  }
});

// 2. Check for large components
console.log('\n📦 Checking component sizes...');
const componentsDir = 'components';
if (fs.existsSync(componentsDir)) {
  const componentFiles = fs.readdirSync(componentsDir, { recursive: true });
  componentFiles.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join(componentsDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = stats.size / 1024;
      
      if (sizeKB > 50) {
        issues.push(`⚠️  Large component: ${file} (${sizeKB.toFixed(1)}KB)`);
        console.log(`   Large: ${file} (${sizeKB.toFixed(1)}KB)`);
      }
    }
  });
}

// 3. Check for optimization opportunities
console.log('\n⚡ Checking optimization opportunities...');

// Check if dynamic imports are used
console.log('   Checking for dynamic imports...');
let hasDynamicImports = false;
try {
  const appFiles = fs.readdirSync('app', { recursive: true });
  for (const file of appFiles) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join('app', file);
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('dynamic(') || content.includes('lazy(')) {
        hasDynamicImports = true;
        break;
      }
    }
  }
} catch (error) {
  console.log('   ⚠️  Error checking dynamic imports:', error.message);
}

if (!hasDynamicImports) {
  issues.push('💡 Consider using dynamic imports for heavy components');
  console.log('   💡 Consider using dynamic imports for heavy components');
}

// 4. Check for image optimization
console.log('\n🖼️  Checking image optimization...');
let hasNextImage = false;
try {
  const appFiles = fs.readdirSync('app', { recursive: true });
  for (const file of appFiles) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join('app', file);
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('next/image') || content.includes('Image from')) {
        hasNextImage = true;
        break;
      }
    }
  }
} catch (error) {
  console.log('   ⚠️  Error checking image optimization:', error.message);
}

if (!hasNextImage) {
  issues.push('🖼️  Consider using Next.js Image component for optimization');
  console.log('   🖼️  Consider using Next.js Image component for optimization');
}

// 5. Check bundle size
console.log('\n📊 Checking bundle configuration...');
if (fs.existsSync('next.config.mjs')) {
  const config = fs.readFileSync('next.config.mjs', 'utf8');
  if (config.includes('optimizeCss')) {
    console.log('   ✅ CSS optimization enabled');
  } else {
    issues.push('💡 Enable CSS optimization in next.config.mjs');
    console.log('   💡 Enable CSS optimization in next.config.mjs');
  }
}

// Summary
console.log('\n📋 SUMMARY OF FINDINGS');
console.log('========================');

if (issues.length === 0) {
  console.log('🎉 No immediate performance issues found!');
} else {
  console.log(`Found ${issues.length} issues to address:`);
  issues.forEach(issue => console.log(`   ${issue}`));
}

// Recommendations
console.log('\n💡 IMMEDIATE OPTIMIZATION ACTIONS');
console.log('==================================');

console.log('1. 🚨 Fix missing routes:');
missingRoutes.forEach(route => {
  if (!fs.existsSync(route)) {
    console.log(`   - Create ${route}`);
  }
});

console.log('\n2. ⚡ Implement performance improvements:');
console.log('   - Add loading states to dashboard pages');
console.log('   - Implement lazy loading for heavy components');
console.log('   - Add error boundaries for better UX');
console.log('   - Optimize images using Next.js Image component');

console.log('\n3. 📊 Monitor performance:');
console.log('   - Use Lighthouse CI for automated testing');
console.log('   - Implement performance monitoring');
console.log('   - Set up Core Web Vitals tracking');

console.log('\n🏁 Performance optimization analysis complete!'); 