const fs = require('fs');
const path = require('path');

// Targeted Error Analysis - Focus on source files only
// Exclude .next generated files and focus on actual source code errors

function analyzeSourceErrors() {
    console.log('🔍 Analyzing TypeScript errors in source files...');
    console.log('================================================');
    
    // Read the error file
    const errorContent = fs.readFileSync('typescript-errors.txt', 'utf8');
    const lines = errorContent.split('\n');
    
    // Filter out .next generated files and focus on source files
    const sourceErrors = lines.filter(line => 
        !line.includes('.next/types/') && 
        (line.includes('.ts:') || line.includes('.tsx:')) &&
        line.includes('error TS')
    );
    
    console.log(`Total source file errors: ${sourceErrors.length}`);
    
    // Categorize errors
    const errorCategories = {
        missingProperties: [],
        missingVariables: [],
        propertyAccess: [],
        unusedParams: [],
        mongodbAssertions: [],
        importExport: [],
        other: []
    };
    
    let currentFile = '';
    
    sourceErrors.forEach(line => {
        // Extract file path
        const fileMatch = line.match(/^(.+\.(ts|tsx)):(\d+):(\d+)/);
        if (fileMatch) {
            currentFile = fileMatch[1];
        }
        
        // Extract error code and categorize
        const errorMatch = line.match(/error TS(\d+)/);
        if (errorMatch) {
            const code = parseInt(errorMatch[1]);
            const errorInfo = {
                file: currentFile,
                line: line.trim(),
                code: code
            };
            
            // Categorize based on error code and content
            if (code === 2551 || code === 2561 || code === 2339) {
                // Property does not exist, Object literal may only specify known properties
                if (line.includes('processingTime') || line.includes('type') || line.includes('score') || 
                    line.includes('matchPercentage') || line.includes('criticalPath') || 
                    line.includes('success') || line.includes('data')) {
                    errorCategories.missingProperties.push(errorInfo);
                } else if (line.includes('_') && line.includes('does not exist')) {
                    errorCategories.propertyAccess.push(errorInfo);
                } else {
                    errorCategories.other.push(errorInfo);
                }
            } else if (code === 2304) {
                // Cannot find name
                if (line.includes('socket') || line.includes('userId') || line.includes('roomId') || 
                    line.includes('criteria') || line.includes('venue') || line.includes('vendor') ||
                    line.includes('guestList') || line.includes('venueCapacity') || line.includes('tableCount') ||
                    line.includes('tables') || line.includes('style') || line.includes('colorScheme') ||
                    line.includes('season') || line.includes('type') || line.includes('totalBudget') ||
                    line.includes('guestCount') || line.includes('complexity')) {
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
    });
    
    // Generate analysis report
    console.log('\n📊 Source File Error Analysis:');
    console.log('==============================');
    
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
            
            // Show sample errors for this category
            console.log('\n  Sample errors:');
            errors.slice(0, 3).forEach(error => {
                console.log(`    ${error.line}`);
            });
        }
    });
    
    // Generate prioritized fix plan
    console.log('\n🎯 Prioritized Fix Plan:');
    console.log('========================');
    
    const priorities = [
        { category: 'missingProperties', priority: 1, reason: 'Critical - breaks type safety', count: errorCategories.missingProperties.length },
        { category: 'missingVariables', priority: 2, reason: 'High - breaks compilation', count: errorCategories.missingVariables.length },
        { category: 'propertyAccess', priority: 3, reason: 'High - breaks runtime', count: errorCategories.propertyAccess.length },
        { category: 'mongodbAssertions', priority: 4, reason: 'Medium - database operations', count: errorCategories.mongodbAssertions.length },
        { category: 'unusedParams', priority: 5, reason: 'Low - code quality', count: errorCategories.unusedParams.length },
        { category: 'importExport', priority: 6, reason: 'Low - code organization', count: errorCategories.importExport.length },
        { category: 'other', priority: 7, reason: 'Low - miscellaneous', count: errorCategories.other.length }
    ];
    
    priorities.forEach(({ category, priority, reason, count }) => {
        if (count > 0) {
            console.log(`${priority}. ${category.toUpperCase()}: ${count} errors - ${reason}`);
        }
    });
    
    // Save detailed analysis
    const analysisData = {
        timestamp: new Date().toISOString(),
        totalSourceErrors: sourceErrors.length,
        categories: errorCategories,
        priorities: priorities.filter(p => p.count > 0)
    };
    
    fs.writeFileSync('source-error-analysis.json', JSON.stringify(analysisData, null, 2));
    console.log('\n💾 Detailed analysis saved to source-error-analysis.json');
    
    return analysisData;
}

// Main execution
if (require.main === module) {
    analyzeSourceErrors();
}

module.exports = { analyzeSourceErrors };

