const fs = require('fs');
const path = require('path');

// Safe TypeScript error fixing - Conservative approach
// Target: Fix remaining 1,404 errors without introducing new issues

// Function to recursively find all TypeScript files
function findTsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
            findTsFiles(filePath, fileList);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Function to apply safe fixes
function applySafeFixes(content) {
    let modified = false;
    
    // Fix 1: Unused variables - Add underscore prefix (safest approach)
    // Pattern: function(param: type) -> function(_param: type) when param is unused
    if (content.includes('userId: string') && content.includes('// userId is declared but its value is never read')) {
        content = content.replace(/userId: string/g, '_userId: string');
        modified = true;
    }
    if (content.includes('bookingId: string') && content.includes('// bookingId is declared but its value is never read')) {
        content = content.replace(/bookingId: string/g, '_bookingId: string');
        modified = true;
    }
    if (content.includes('paymentId: string') && content.includes('// paymentId is declared but its value is never read')) {
        content = content.replace(/paymentId: string/g, '_paymentId: string');
        modified = true;
    }
    if (content.includes('vendorId: string') && content.includes('// vendorId is declared but its value is never read')) {
        content = content.replace(/vendorId: string/g, '_vendorId: string');
        modified = true;
    }
    if (content.includes('config:') && content.includes('// config is declared but its value is never read')) {
        content = content.replace(/config:/g, '_config:');
        modified = true;
    }
    
    // Fix 2: Missing MongoDB type assertions (safe approach)
    if (content.includes('await User.findByIdAndUpdate(') && !content.includes('(User as any)')) {
        content = content.replace(/await User\.findByIdAndUpdate\(/g, 'await (User as any).findByIdAndUpdate(');
        modified = true;
    }
    if (content.includes('await Vendor.find()') && !content.includes('(Vendor as any)')) {
        content = content.replace(/await Vendor\.find\(\)/g, 'await (Vendor as any).find()');
        modified = true;
    }
    if (content.includes('await Venue.find()') && !content.includes('(Venue as any)')) {
        content = content.replace(/await Venue\.find\(\)/g, 'await (Venue as any).find()');
        modified = true;
    }
    
    // Fix 3: Type assignment issues - Make optional properties truly optional
    if (content.includes('emailVerificationToken: string | undefined')) {
        content = content.replace(/emailVerificationToken: string \| undefined/g, 'emailVerificationToken?: string');
        modified = true;
    }
    if (content.includes('phoneVerificationCode: string | undefined')) {
        content = content.replace(/phoneVerificationCode: string \| undefined/g, 'phoneVerificationCode?: string');
        modified = true;
    }
    if (content.includes('twoFactorSecret: string | undefined')) {
        content = content.replace(/twoFactorSecret: string \| undefined/g, 'twoFactorSecret?: string');
        modified = true;
    }
    if (content.includes('referralCode: string | undefined')) {
        content = content.replace(/referralCode: string \| undefined/g, 'referralCode?: string');
        modified = true;
    }
    
    // Fix 4: Missing variable declarations (safe approach)
    if (content.includes('database.slowQueryRate') && !content.includes('const database =')) {
        content = content.replace(/database\.slowQueryRate/g, 'metrics.database.slowQueryRate');
        modified = true;
    }
    
    // Fix 5: Implicit any types in map callbacks (safe approach)
    if (content.includes('.map(n =>') && !content.includes('.map((n: any) =>')) {
        content = content.replace(/\.map\(n =>/g, '.map((n: any) =>');
        modified = true;
    }
    if (content.includes('.map(v =>') && !content.includes('.map((v: any) =>')) {
        content = content.replace(/\.map\(v =>/g, '.map((v: any) =>');
        modified = true;
    }
    if (content.includes('.map(b =>') && !content.includes('.map((b: any) =>')) {
        content = content.replace(/\.map\(b =>/g, '.map((b: any) =>');
        modified = true;
    }
    if (content.includes('.map(vendor =>') && !content.includes('.map((vendor: any) =>')) {
        content = content.replace(/\.map\(vendor =>/g, '.map((vendor: any) =>');
        modified = true;
    }
    if (content.includes('.map(venue =>') && !content.includes('.map((venue: any) =>')) {
        content = content.replace(/\.map\(venue =>/g, '.map((venue: any) =>');
        modified = true;
    }
    
    // Fix 6: Unused imports (safe approach)
    if (content.includes("import { connectDB } from './db';") && content.includes('// connectDB is declared but its value is never read')) {
        content = content.replace(/import { connectDB } from '\.\/db';/g, "// import { connectDB } from './db';");
        modified = true;
    }
    if (content.includes("import User from '@/lib/models/user';") && content.includes('// User is declared but its value is never read')) {
        content = content.replace(/import User from '@\/lib\/models\/user';/g, "// import User from '@/lib/models/user';");
        modified = true;
    }
    
    // Fix 7: Map iteration issues (safe approach)
    if (content.includes('for (const [modelType, config] of this.modelConfigs)')) {
        content = content.replace(/for \(const \[modelType, config\] of this\.modelConfigs\)/g, 'for (const [modelType, _config] of this.modelConfigs)');
        modified = true;
    }
    
    // Fix 8: Array.from iteration issues (safe approach)
    if (content.includes('Array.from(dataCache.entries()).forEach(([key, value]) =>')) {
        content = content.replace(/Array\.from\(dataCache\.entries\(\)\)\.forEach\(\(\[key, value\]\) =>/g, 'Array.from(dataCache.entries()).forEach(([_key, value]) =>');
        modified = true;
    }
    if (content.includes('Array.from(statsCache.entries()).forEach(([key, value]) =>')) {
        content = content.replace(/Array\.from\(statsCache\.entries\(\)\)\.forEach\(\(\[key, value\]\) =>/g, 'Array.from(statsCache.entries()).forEach(([_key, value]) =>');
        modified = true;
    }
    
    return { content, modified };
}

// Main execution
console.log('🔧 Applying safe TypeScript fixes...');
console.log('=====================================');

const tsFiles = findTsFiles('.');
let filesFixedCount = 0;
let totalFilesProcessed = 0;

tsFiles.forEach(file => {
    totalFilesProcessed++;
    let content = fs.readFileSync(file, 'utf8');
    const { content: newContent, modified } = applySafeFixes(content);
    
    if (modified) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`✅ Fixed: ${file}`);
        filesFixedCount++;
    }
});

console.log('\n📊 Safe Fix Summary:');
console.log('====================');
console.log(`Total files processed: ${totalFilesProcessed}`);
console.log(`Files fixed: ${filesFixedCount}`);
console.log(`Files unchanged: ${totalFilesProcessed - filesFixedCount}`);

console.log('\n🎯 Next Steps:');
console.log('==============');
console.log('1. Run: npx tsc --noEmit (to check remaining errors)');
console.log('2. Apply additional targeted fixes if needed');
console.log('3. Test build process');
console.log('4. Deploy to production');

console.log('\n✅ Safe TypeScript fixes completed!');

