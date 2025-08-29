#!/bin/bash

# 🚨 Comprehensive Error & Bug Catching Script
# This script runs all available error detection tools

set -e  # Exit on any error

echo "🔍 Starting comprehensive error check..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js and npm
if ! command_exists node; then
    print_status "ERROR" "Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    print_status "ERROR" "npm is not installed"
    exit 1
fi

print_status "INFO" "Node.js version: $(node --version)"
print_status "INFO" "npm version: $(npm --version)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "INFO" "Installing dependencies..."
    npm install
fi

# 1. ESLint Check
print_status "INFO" "Running ESLint..."
if npm run lint > /dev/null 2>&1; then
    print_status "SUCCESS" "ESLint passed - No linting errors found"
else
    print_status "ERROR" "ESLint failed - Linting errors found"
    npm run lint
    ESLINT_ERRORS=true
fi

# 2. TypeScript Type Check
print_status "INFO" "Running TypeScript type check..."
if npm run type-check > /dev/null 2>&1; then
    print_status "SUCCESS" "TypeScript type check passed - No type errors found"
else
    print_status "ERROR" "TypeScript type check failed - Type errors found"
    npm run type-check
    TYPESCRIPT_ERRORS=true
fi

# 3. Prettier Format Check
print_status "INFO" "Checking code formatting..."
if npm run format:check > /dev/null 2>&1; then
    print_status "SUCCESS" "Prettier format check passed - Code is properly formatted"
else
    print_status "WARNING" "Prettier format check failed - Code formatting issues found"
    npm run format:check
    FORMAT_ERRORS=true
fi

# 4. Security Audit
print_status "INFO" "Running security audit..."
if npm audit --audit-level=moderate > /dev/null 2>&1; then
    print_status "SUCCESS" "Security audit passed - No security vulnerabilities found"
else
    print_status "ERROR" "Security audit failed - Security vulnerabilities detected"
    npm audit --audit-level=moderate
    SECURITY_ERRORS=true
fi

# 5. Build Check
print_status "INFO" "Testing build process..."
if npm run build > /dev/null 2>&1; then
    print_status "SUCCESS" "Build test passed - Application builds successfully"
else
    print_status "ERROR" "Build test failed - Build errors detected"
    npm run build
    BUILD_ERRORS=true
fi

# 6. Test Coverage (if tests exist)
if [ -d "__tests__" ] || [ -f "jest.config.js" ] || [ -f "jest.config.ts" ]; then
    print_status "INFO" "Running tests..."
    if npm run test:coverage > /dev/null 2>&1; then
        print_status "SUCCESS" "Tests passed - All tests are green"
    else
        print_status "ERROR" "Tests failed - Test failures detected"
        npm run test:coverage
        TEST_ERRORS=true
    fi
else
    print_status "WARNING" "No test configuration found - Skipping tests"
fi

# 7. Bundle Analysis (if available)
if command_exists "next-bundle-analyzer" || grep -q "bundle-analyzer" package.json; then
    print_status "INFO" "Analyzing bundle size..."
    if npm run build:analyze > /dev/null 2>&1; then
        print_status "SUCCESS" "Bundle analysis completed"
    else
        print_status "WARNING" "Bundle analysis failed"
    fi
fi

# 8. Check for common issues
print_status "INFO" "Checking for common issues..."

# Check for console.log statements in production code
CONSOLE_LOGS=$(grep -r "console\." --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -v "node_modules" | grep -v "__tests__" | grep -v "scripts" || true)
if [ -n "$CONSOLE_LOGS" ]; then
    print_status "WARNING" "Console statements found in source code:"
    echo "$CONSOLE_LOGS"
fi

# Check for TODO/FIXME comments
TODOS=$(grep -r -i "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -v "node_modules" | grep -v "__tests__" || true)
if [ -n "$TODOS" ]; then
    print_status "WARNING" "TODO/FIXME comments found:"
    echo "$TODOS"
fi

# Check for large files
LARGE_FILES=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v "node_modules" | grep -v ".next" | xargs wc -l | sort -nr | head -5)
print_status "INFO" "Largest source files by line count:"
echo "$LARGE_FILES"

# Summary
echo ""
echo "📊 Error Check Summary:"
echo "========================"

if [ "$ESLINT_ERRORS" = true ]; then
    print_status "ERROR" "ESLint errors found"
fi

if [ "$TYPESCRIPT_ERRORS" = true ]; then
    print_status "ERROR" "TypeScript type errors found"
fi

if [ "$FORMAT_ERRORS" = true ]; then
    print_status "WARNING" "Code formatting issues found"
fi

if [ "$SECURITY_ERRORS" = true ]; then
    print_status "ERROR" "Security vulnerabilities detected"
fi

if [ "$BUILD_ERRORS" = true ]; then
    print_status "ERROR" "Build errors detected"
fi

if [ "$TEST_ERRORS" = true ]; then
    print_status "ERROR" "Test failures detected"
fi

# Overall status
if [ "$ESLINT_ERRORS" = true ] || [ "$TYPESCRIPT_ERRORS" = true ] || [ "$SECURITY_ERRORS" = true ] || [ "$BUILD_ERRORS" = true ] || [ "$TEST_ERRORS" = true ]; then
    echo ""
    print_status "ERROR" "❌ Error check failed - Issues need to be resolved before deployment"
    exit 1
else
    echo ""
    print_status "SUCCESS" "🎉 All error checks passed! Your code is ready for deployment"
fi

# Recommendations
echo ""
echo "💡 Recommendations:"
echo "=================="
echo "1. Fix any errors or warnings shown above"
echo "2. Run 'npm run format' to auto-fix formatting issues"
echo "3. Run 'npm run lint:fix' to auto-fix linting issues"
echo "4. Consider adding more tests if coverage is low"
echo "5. Review security audit results and update dependencies if needed"
echo "6. Use 'npm run error-check' for quick validation before commits"
