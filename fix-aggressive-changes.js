const fs = require('fs');
const path = require('path');

// Fix aggressive changes that introduced new errors
// Target: Revert incorrect underscore prefixes and fix only real unused parameters

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

function fixAggressiveChanges(content) {
    let modified = false;
    
    // Fix 1: Revert incorrect property name changes in interfaces/types
    const propertyReverts = [
        // AI Processing types
        { pattern: /_data: Record<string, unknown>/g, replacement: 'data: Record<string, unknown>' },
        { pattern: /_success: boolean/g, replacement: 'success: boolean' },
        { pattern: /_score: number/g, replacement: 'score: number' },
        { pattern: /_matchPercentage: number/g, replacement: 'matchPercentage: number' },
        { pattern: /_totalBudget: number/g, replacement: 'totalBudget: number' },
        { pattern: /_costSavings: number/g, replacement: 'costSavings: number' },
        { pattern: /_suggestions: string\[\]/g, replacement: 'suggestions: string[]' },
        { pattern: /_criticalPath: string\[\]/g, replacement: 'criticalPath: string[]' },
        { pattern: /_task: string/g, replacement: 'task: string' },
        { pattern: /_dependencies: string\[\]/g, replacement: 'dependencies: string[]' },
        
        // Other common property reverts
        { pattern: /_reasons: string\[\]/g, replacement: 'reasons: string[]' },
        { pattern: /_tables: Record<string, unknown>\[\]/g, replacement: 'tables: Record<string, unknown>[]' },
        { pattern: /_suggestions: string\[\]/g, replacement: 'suggestions: string[]' }
    ];
    
    propertyReverts.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            modified = true;
        }
    });
    
    // Fix 2: Revert incorrect parameter changes in function signatures
    const parameterReverts = [
        // Only revert if it's clearly a function parameter, not a property
        { pattern: /function.*\(_data: Record<string, unknown>\)/g, replacement: 'function(data: Record<string, unknown>)' },
        { pattern: /function.*\(_success: boolean\)/g, replacement: 'function(success: boolean)' },
        { pattern: /function.*\(_score: number\)/g, replacement: 'function(score: number)' },
        { pattern: /function.*\(_matchPercentage: number\)/g, replacement: 'function(matchPercentage: number)' },
        { pattern: /function.*\(_totalBudget: number\)/g, replacement: 'function(totalBudget: number)' },
        { pattern: /function.*\(_costSavings: number\)/g, replacement: 'function(costSavings: number)' },
        { pattern: /function.*\(_suggestions: string\[\]\)/g, replacement: 'function(suggestions: string[])' },
        { pattern: /function.*\(_criticalPath: string\[\]\)/g, replacement: 'function(criticalPath: string[])' },
        { pattern: /function.*\(_task: string\)/g, replacement: 'function(task: string)' },
        { pattern: /function.*\(_dependencies: string\[\]\)/g, replacement: 'function(dependencies: string[])' }
    ];
    
    parameterReverts.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            modified = true;
        }
    });
    
    // Fix 3: Revert incorrect property access changes
    const accessReverts = [
        { pattern: /request\._data/g, replacement: 'request.data' },
        { pattern: /response\._success/g, replacement: 'response.success' },
        { pattern: /item\._score/g, replacement: 'item.score' },
        { pattern: /item\._matchPercentage/g, replacement: 'item.matchPercentage' },
        { pattern: /item\._task/g, replacement: 'item.task' },
        { pattern: /item\._dependencies/g, replacement: 'item.dependencies' },
        { pattern: /optimization\._totalBudget/g, replacement: 'optimization.totalBudget' },
        { pattern: /optimization\._costSavings/g, replacement: 'optimization.costSavings' },
        { pattern: /optimization\._suggestions/g, replacement: 'optimization.suggestions' },
        { pattern: /optimization\._criticalPath/g, replacement: 'optimization.criticalPath' }
    ];
    
    accessReverts.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            modified = true;
        }
    });
    
    // Fix 4: Revert incorrect object literal property names
    const objectLiteralReverts = [
        { pattern: /_data:/g, replacement: 'data:' },
        { pattern: /_success:/g, replacement: 'success:' },
        { pattern: /_score:/g, replacement: 'score:' },
        { pattern: /_matchPercentage:/g, replacement: 'matchPercentage:' },
        { pattern: /_totalBudget:/g, replacement: 'totalBudget:' },
        { pattern: /_costSavings:/g, replacement: 'costSavings:' },
        { pattern: /_suggestions:/g, replacement: 'suggestions:' },
        { pattern: /_criticalPath:/g, replacement: 'criticalPath:' },
        { pattern: /_task:/g, replacement: 'task:' },
        { pattern: /_dependencies:/g, replacement: 'dependencies:' }
    ];
    
    objectLiteralReverts.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            modified = true;
        }
    });
    
    // Fix 5: Revert incorrect array/object destructuring
    const destructuringReverts = [
        { pattern: /const { _data }/g, replacement: 'const { data }' },
        { pattern: /const { _success }/g, replacement: 'const { success }' },
        { pattern: /const { _score }/g, replacement: 'const { score }' },
        { pattern: /const { _matchPercentage }/g, replacement: 'const { matchPercentage }' },
        { pattern: /const { _totalBudget }/g, replacement: 'const { totalBudget }' },
        { pattern: /const { _costSavings }/g, replacement: 'const { costSavings }' },
        { pattern: /const { _suggestions }/g, replacement: 'const { suggestions }' },
        { pattern: /const { _criticalPath }/g, replacement: 'const { criticalPath }' },
        { pattern: /const { _task }/g, replacement: 'const { task }' },
        { pattern: /const { _dependencies }/g, replacement: 'const { dependencies }' }
    ];
    
    destructuringReverts.forEach(({ pattern, replacement }) => {
        if (pattern.test(content)) {
            content = content.replace(pattern, replacement);
            modified = true;
        }
    });
    
    return { content, modified };
}

// Main execution
console.log('🔧 Fixing aggressive changes that introduced new errors...');
console.log('========================================================');

const tsFiles = findTsFiles('.');
let filesFixedCount = 0;
let totalFilesProcessed = 0;

tsFiles.forEach(file => {
    totalFilesProcessed++;
    let content = fs.readFileSync(file, 'utf8');
    const { content: newContent, modified } = fixAggressiveChanges(content);
    
    if (modified) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`✅ Fixed: ${file}`);
        filesFixedCount++;
    }
});

console.log('\n📊 Aggressive Changes Fix Summary:');
console.log('===================================');
console.log(`Total files processed: ${totalFilesProcessed}`);
console.log(`Files fixed: ${filesFixedCount}`);
console.log(`Files unchanged: ${totalFilesProcessed - filesFixedCount}`);

console.log('\n🎯 Next Steps:');
console.log('==============');
console.log('1. Run: npx tsc --noEmit (to check remaining errors)');
console.log('2. Apply targeted fixes for real unused parameters');
console.log('3. Test build process');
console.log('4. Deploy to production');

console.log('\n✅ Aggressive changes fix completed!');
