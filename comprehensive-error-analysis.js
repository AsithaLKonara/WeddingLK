const fs = require('fs');

// Comprehensive Error Analysis based on actual error patterns
// Focus on the most critical and fixable errors first

function analyzeErrors() {
    console.log('🔍 Comprehensive TypeScript Error Analysis');
    console.log('==========================================');
    
    // Read the error file
    const errorContent = fs.readFileSync('typescript-errors.txt', 'utf8');
    const lines = errorContent.split('\n');
    
    // Filter source file errors (exclude .next generated files)
    const sourceErrors = lines.filter(line => 
        !line.includes('.next/types/') && 
        (line.includes('.ts:') || line.includes('.tsx:')) &&
        line.includes('error TS')
    );
    
    console.log(`Total source file errors: ${sourceErrors.length}`);
    
    // Categorize errors based on actual patterns observed
    const errorCategories = {
        propertyAccess: [],      // _isValid vs isValid, _errors vs errors
        missingVariables: [],    // connectDB, User, item
        missingProperties: [],   // processingTime, type, score
        unusedParams: [],        // TS6133 errors
        mongodbAssertions: [],   // Database operation type issues
        importExport: [],        // Import/export issues
        other: []               // Everything else
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
            
            // Categorize based on observed patterns
            if (code === 2551) {
                // Property does not exist - most common pattern
                if (line.includes('_isValid') || line.includes('_errors') || 
                    line.includes('_vendors') || line.includes('_venues') || 
                    line.includes('_cached') || line.includes('_query') ||
                    line.includes('_url') || line.includes('_method') || 
                    line.includes('_body')) {
                    errorCategories.propertyAccess.push(errorInfo);
                } else {
                    errorCategories.other.push(errorInfo);
                }
            } else if (code === 2304) {
                // Cannot find name
                if (line.includes('connectDB') || line.includes('User') || 
                    line.includes('item') || line.includes('socket') ||
                    line.includes('userId') || line.includes('roomId')) {
                    errorCategories.missingVariables.push(errorInfo);
                } else {
                    errorCategories.other.push(errorInfo);
                }
            } else if (code === 6133) {
                // Unused parameter/variable
                errorCategories.unusedParams.push(errorInfo);
            } else if (code === 2561 || code === 2353) {
                // Object literal property issues
                if (line.includes('processingTime') || line.includes('type') || 
                    line.includes('score') || line.includes('id')) {
                    errorCategories.missingProperties.push(errorInfo);
                } else {
                    errorCategories.other.push(errorInfo);
                }
            } else if (code === 2349) {
                // This expression is not callable (MongoDB operations)
                errorCategories.mongodbAssertions.push(errorInfo);
            } else {
                errorCategories.other.push(errorInfo);
            }
        }
    });
    
    // Generate analysis report
    console.log('\n📊 Error Categories Analysis:');
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
        { 
            category: 'propertyAccess', 
            priority: 1, 
            reason: 'Critical - Most common error pattern (underscore prefix mismatches)',
            count: errorCategories.propertyAccess.length,
            fixStrategy: 'Fix underscore prefix mismatches systematically'
        },
        { 
            category: 'missingVariables', 
            priority: 2, 
            reason: 'High - Missing imports and variable declarations',
            count: errorCategories.missingVariables.length,
            fixStrategy: 'Add missing imports and variable declarations'
        },
        { 
            category: 'missingProperties', 
            priority: 3, 
            reason: 'High - Missing interface properties',
            count: errorCategories.missingProperties.length,
            fixStrategy: 'Add missing properties to interfaces'
        },
        { 
            category: 'mongodbAssertions', 
            priority: 4, 
            reason: 'Medium - Database operation type issues',
            count: errorCategories.mongodbAssertions.length,
            fixStrategy: 'Add type assertions for MongoDB operations'
        },
        { 
            category: 'unusedParams', 
            priority: 5, 
            reason: 'Low - Code quality (unused parameters)',
            count: errorCategories.unusedParams.length,
            fixStrategy: 'Fix unused parameters safely'
        },
        { 
            category: 'other', 
            priority: 6, 
            reason: 'Low - Miscellaneous issues',
            count: errorCategories.other.length,
            fixStrategy: 'Address miscellaneous issues'
        }
    ];
    
    priorities.forEach(({ category, priority, reason, count, fixStrategy }) => {
        if (count > 0) {
            console.log(`${priority}. ${category.toUpperCase()}: ${count} errors`);
            console.log(`   Reason: ${reason}`);
            console.log(`   Strategy: ${fixStrategy}`);
            console.log('');
        }
    });
    
    // Create specific fix recommendations
    console.log('\n🛠️ Specific Fix Recommendations:');
    console.log('=================================');
    
    // Property Access Fixes
    if (errorCategories.propertyAccess.length > 0) {
        console.log('\n1. PROPERTY ACCESS FIXES (Priority 1):');
        console.log('   - Fix _isValid → isValid property access');
        console.log('   - Fix _errors → errors property access');
        console.log('   - Fix _vendors → vendors property access');
        console.log('   - Fix _venues → venues property access');
        console.log('   - Fix _cached → cached property access');
        console.log('   - Fix _query → query property access');
        console.log('   - Fix _url → url property access');
        console.log('   - Fix _method → method property access');
        console.log('   - Fix _body → body property access');
    }
    
    // Missing Variables Fixes
    if (errorCategories.missingVariables.length > 0) {
        console.log('\n2. MISSING VARIABLES FIXES (Priority 2):');
        console.log('   - Add missing connectDB imports');
        console.log('   - Add missing User model imports');
        console.log('   - Fix missing item variable declarations');
        console.log('   - Fix missing socket variable declarations');
        console.log('   - Fix missing userId/roomId variable declarations');
    }
    
    // Missing Properties Fixes
    if (errorCategories.missingProperties.length > 0) {
        console.log('\n3. MISSING PROPERTIES FIXES (Priority 3):');
        console.log('   - Add processingTime property to interfaces');
        console.log('   - Add type property to interfaces');
        console.log('   - Add score property to interfaces');
        console.log('   - Add id property to interfaces');
    }
    
    // Save detailed analysis
    const analysisData = {
        timestamp: new Date().toISOString(),
        totalSourceErrors: sourceErrors.length,
        categories: errorCategories,
        priorities: priorities.filter(p => p.count > 0),
        recommendations: {
            propertyAccess: errorCategories.propertyAccess.length,
            missingVariables: errorCategories.missingVariables.length,
            missingProperties: errorCategories.missingProperties.length,
            mongodbAssertions: errorCategories.mongodbAssertions.length,
            unusedParams: errorCategories.unusedParams.length,
            other: errorCategories.other.length
        }
    };
    
    fs.writeFileSync('comprehensive-error-analysis.json', JSON.stringify(analysisData, null, 2));
    console.log('\n💾 Detailed analysis saved to comprehensive-error-analysis.json');
    
    return analysisData;
}

// Main execution
if (require.main === module) {
    analyzeErrors();
}

module.exports = { analyzeErrors };

