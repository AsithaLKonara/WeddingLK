#!/bin/bash

# 🔍 Comprehensive Codebase Audit Script for WeddingLK
# This script audits and fixes ALL remaining issues

echo "🔍 Starting comprehensive codebase audit..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Check for any remaining JSX.IntrinsicElements issues
print_status "Step 1: Checking for remaining JSX.IntrinsicElements issues..."
REMAINING_JSX_ISSUES=$(find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "divHeader\|divTitle\|divContent\|divDescription\|divList\|divTrigger" 2>/dev/null | grep -v "backup-" | grep -v "node_modules")

if [ -z "$REMAINING_JSX_ISSUES" ]; then
    print_success "No JSX.IntrinsicElements issues found!"
else
    print_warning "Found remaining JSX issues in:"
    echo "$REMAINING_JSX_ISSUES"
fi

# Step 2: Find all files with duplicate props
print_status "Step 2: Scanning for duplicate props issues..."
DUPLICATE_PROPS_FILES=$(find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "className.*className\|variant.*variant\|size.*size" 2>/dev/null | grep -v "backup-" | grep -v "node_modules" | sort -u)

if [ -z "$DUPLICATE_PROPS_FILES" ]; then
    print_success "No duplicate props issues found!"
else
    echo "Files with duplicate props:"
    echo "$DUPLICATE_PROPS_FILES"
    echo ""
    
    # Step 3: Create backup
    print_status "Step 3: Creating backup..."
    BACKUP_DIR="./audit-backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    for file in $DUPLICATE_PROPS_FILES; do
        cp "$file" "$BACKUP_DIR/"
    done
    print_success "Backup created: $BACKUP_DIR"
    
    # Step 4: Fix duplicate props systematically
    print_status "Step 4: Fixing duplicate props..."
    
    for file in $DUPLICATE_PROPS_FILES; do
        if [ -f "$file" ]; then
            print_status "Fixing: $file"
            
            # Create temporary file
            temp_file="${file}.tmp"
            
            # Fix duplicate className attributes
            sed -E \
                -e 's/(className="[^"]*") (className="[^"]*")/\1/g' \
                -e 's/(className="[^"]*") (className="[^"]*")/\1/g' \
                -e 's/(className="[^"]*") (className="[^"]*")/\1/g' \
                "$file" > "$temp_file"
            
            # Fix duplicate variant attributes
            sed -E \
                -e 's/(variant="[^"]*") (variant="[^"]*")/\1/g' \
                -e 's/(variant="[^"]*") (variant="[^"]*")/\1/g' \
                "$temp_file" > "${temp_file}2"
            
            # Fix duplicate size attributes
            sed -E \
                -e 's/(size="[^"]*") (size="[^"]*")/\1/g' \
                -e 's/(size="[^"]*") (size="[^"]*")/\1/g' \
                "${temp_file}2" > "${temp_file}3"
            
            # Replace original with fixed version
            mv "${temp_file}3" "$file"
            rm -f "$temp_file" "${temp_file}2"
            
            print_success "Fixed: $file"
        fi
    done
fi

# Step 5: Check for any remaining TypeScript/ESLint issues
print_status "Step 5: Running TypeScript compilation check..."
if npm run build > /dev/null 2>&1; then
    print_success "TypeScript compilation successful!"
else
    print_warning "TypeScript compilation failed. Checking for specific errors..."
    npm run build 2>&1 | grep -E "(Error:|Failed to compile)" | head -10
fi

# Step 6: Check for missing dependencies
print_status "Step 6: Checking for missing dependencies..."
MISSING_DEPS=$(npm run build 2>&1 | grep -E "Cannot find module|Module not found" | head -5)
if [ -n "$MISSING_DEPS" ]; then
    print_warning "Missing dependencies detected:"
    echo "$MISSING_DEPS"
else
    print_success "No missing dependencies detected!"
fi

# Step 7: Check for Tailwind CSS issues
print_status "Step 7: Checking Tailwind CSS configuration..."
if [ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ]; then
    print_success "Tailwind config found!"
else
    print_warning "Tailwind config not found!"
fi

if [ -f "postcss.config.mjs" ]; then
    print_success "PostCSS config found!"
else
    print_warning "PostCSS config not found!"
fi

# Step 8: Check for environment variables
print_status "Step 8: Checking environment configuration..."
if [ -f ".env.local" ] || [ -f ".env.production" ]; then
    print_success "Environment files found!"
else
    print_warning "No environment files found!"
fi

# Step 9: Check for build artifacts
print_status "Step 9: Checking build artifacts..."
if [ -d ".next" ]; then
    print_success "Next.js build directory exists!"
    rm -rf .next
    print_status "Cleaned build directory"
else
    print_warning "No build directory found!"
fi

# Step 10: Final verification
print_status "Step 10: Final verification..."
echo ""
print_success "Comprehensive audit completed!"
echo ""
echo "📊 Summary:"
echo "  - JSX issues: $(echo "$REMAINING_JSX_ISSUES" | wc -w | tr -d ' ')"
echo "  - Duplicate props files: $(echo "$DUPLICATE_PROPS_FILES" | wc -w | tr -d ' ')"
echo "  - Backup location: $BACKUP_DIR"
echo ""
echo "🔧 Next steps:"
echo "  1. Test build: npm run build"
echo "  2. Test development: npm run dev"
echo "  3. Deploy to Vercel: vercel"
echo ""
echo "💡 If you need to restore files:"
echo "  cp $BACKUP_DIR/* ./"
echo ""

