const fs = require('fs');
const path = require('path');

// Comprehensive TypeScript Error Analysis Script
// Phase 1: Categorize and prioritize remaining errors

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

function analyzeErrors() {
    console.log('🔍 Analyzing TypeScript errors...');
    console.log('==================================');
    
    // Run TypeScript compiler to get current errors
    const { execSync } = require('child_process');
    
    try {
        const output = execSync('npx tsc --noEmit 2>&1', { encoding: 'utf8' });
        
        // Parse the output to categorize errors
        const errorCategories = {
            missingProperties: [],
            missingVariables: [],
            propertyAccess: [],
            unusedParams: [],
            mongodbAssertions: [],
            importExport: [],
            other: []
        };
        
        const lines = output.split('\n');
        let currentFile = '';
        let errorCount = 0;
        
        lines.forEach(line => {
            if (line.includes('.ts:') || line.includes('.tsx:')) {
                // Extract file path and line number
                const match = line.match(/^(.+\.(ts|tsx)):(\d+):(\d+)/);
                if (match) {
                    currentFile = match[1];
                    errorCount++;
                }
            }
            
            if (line.includes('error TS')) {
                const errorCode = line.match(/error TS(\d+)/);
                if (errorCode) {
                    const code = parseInt(errorCode[1]);
                    const errorInfo = {
                        file: currentFile,
                        line: line,
                        code: code
                    };
                    
                    // Categorize errors based on error codes and content
                    if (code === 2551 || code === 2561 || code === 2339) {
                        // Property does not exist, Object literal may only specify known properties
                        if (line.includes('processingTime') || line.includes('type') || line.includes('score') || 
                            line.includes('matchPercentage') || line.includes('criticalPath')) {
                            errorCategories.missingProperties.push(errorInfo);
                        } else if (line.includes('_') && line.includes('does not exist')) {
                            errorCategories.propertyAccess.push(errorInfo);
                        } else {
                            errorCategories.other.push(errorInfo);
                        }
                    } else if (code === 2304) {
                        // Cannot find name
                        if (line.includes('socket') || line.includes('userId') || line.includes('roomId') || 
                            line.includes('criteria') || line.includes('venue') || line.includes('vendor')) {
                            errorCategories.missingVariables.push(errorInfo);
                        } else if (line.includes('connectDB') || line.includes('import')) {
                            errorCategories.importExport.push(errorInfo);
                        } else {
                            errorCategories.other.push(errorInfo);
                        }
                    } else if (code === 6133) {
                        // Unused parameter
                        errorCategories.unusedParams.push(errorInfo);
                    } else if (code === 2349) {
                        // This expression is not callable
                        if (line.includes('User.') || line.includes('Vendor.') || line.includes('Venue.') || 
                            line.includes('Booking.') || line.includes('Payment.') || line.includes('Review.') || 
                            line.includes('Notification.')) {
                            errorCategories.mongodbAssertions.push(errorInfo);
                        } else {
                            errorCategories.other.push(errorInfo);
                        }
                    } else {
                        errorCategories.other.push(errorInfo);
                    }
                }
            }
        });
        
        // Generate analysis report
        console.log('\n📊 Error Analysis Report:');
        console.log('==========================');
        console.log(`Total errors found: ${errorCount}`);
        console.log(`Total files with errors: ${new Set(Object.values(errorCategories).flat().map(e => e.file)).size}`);
        
        console.log('\n📋 Error Categories:');
        console.log('====================');
        
        Object.entries(errorCategories).forEach(([category, errors]) => {
            if (errors.length > 0) {
                console.log(`\n${category.toUpperCase()}: ${errors.length} errors`);
                console.log('─'.repeat(50));
                
                // Group by file
                const fileGroups = {};
                errors.forEach(error => {
                    if (!fileGroups[error.file]) {
                        fileGroups[error.file] = [];
                    }
                    fileGroups[error.file].push(error);
                });
                
                // Show top 5 files with most errors in this category
                const sortedFiles = Object.entries(fileGroups)
                    .sort(([,a], [,b]) => b.length - a.length)
                    .slice(0, 5);
                
                sortedFiles.forEach(([file, fileErrors]) => {
                    console.log(`  ${file}: ${fileErrors.length} errors`);
                });
            }
        });
        
        // Generate prioritized fix plan
        console.log('\n🎯 Prioritized Fix Plan:');
        console.log('========================');
        
        const priorities = [
            { category: 'missingProperties', priority: 1, reason: 'Critical - breaks type safety' },
            { category: 'missingVariables', priority: 2, reason: 'High - breaks compilation' },
            { category: 'propertyAccess', priority: 3, reason: 'High - breaks runtime' },
            { category: 'mongodbAssertions', priority: 4, reason: 'Medium - database operations' },
            { category: 'unusedParams', priority: 5, reason: 'Low - code quality' },
            { category: 'importExport', priority: 6, reason: 'Low - code organization' },
            { category: 'other', priority: 7, reason: 'Low - miscellaneous' }
        ];
        
        priorities.forEach(({ category, priority, reason }) => {
            const count = errorCategories[category].length;
            if (count > 0) {
                console.log(`${priority}. ${category.toUpperCase()}: ${count} errors - ${reason}`);
            }
        });
        
        // Save detailed analysis to file
        const analysisData = {
            timestamp: new Date().toISOString(),
            totalErrors: errorCount,
            categories: errorCategories,
            priorities: priorities.filter(p => errorCategories[p.category].length > 0)
        };
        
        fs.writeFileSync('error-analysis.json', JSON.stringify(analysisData, null, 2));
        console.log('\n💾 Detailed analysis saved to error-analysis.json');
        
        return analysisData;
        
    } catch (error) {
        console.error('Error running TypeScript compiler:', error.message);
        return null;
    }
}

// Main execution
if (require.main === module) {
    analyzeErrors();
}

module.exports = { analyzeErrors };

