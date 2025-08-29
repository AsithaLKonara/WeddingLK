#!/bin/bash

# 🐛 Comprehensive Bug Fix Script for WeddingLK
# This script finds and fixes all JSX.IntrinsicElements type mismatches

echo "🔍 Starting comprehensive bug detection and fix..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Step 1: Find all files with JSX.IntrinsicElements issues
print_status "Step 1: Scanning for JSX.IntrinsicElements issues..."

# Find all files with problematic elements
PROBLEMATIC_FILES=$(find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "divHeader\|divTitle\|divContent\|divDescription\|divList\|divTrigger" 2>/dev/null)

if [ -z "$PROBLEMATIC_FILES" ]; then
    print_success "No problematic files found!"
    exit 0
fi

echo "Found problematic files:"
echo "$PROBLEMATIC_FILES"
echo ""

# Step 2: Create backup directory
print_status "Step 2: Creating backup directory..."
BACKUP_DIR="./backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
print_success "Backup directory created: $BACKUP_DIR"

# Step 3: Backup original files
print_status "Step 3: Backing up original files..."
for file in $PROBLEMATIC_FILES; do
    cp "$file" "$BACKUP_DIR/"
done
print_success "All files backed up to $BACKUP_DIR"

# Step 4: Fix all the issues systematically
print_status "Step 4: Fixing JSX.IntrinsicElements issues..."

# Function to fix a file
fix_file() {
    local file="$1"
    print_status "Fixing: $file"
    
    # Create temporary file
    local temp_file="${file}.tmp"
    
    # Apply all fixes
    sed -E \
        -e 's/<divHeader([^>]*)>/<div\1>/g' \
        -e 's/<\/divHeader>/<\/div>/g' \
        -e 's/<divTitle([^>]*)>/<h3\1>/g' \
        -e 's/<\/divTitle>/<\/h3>/g' \
        -e 's/<divContent([^>]*)>/<div\1>/g' \
        -e 's/<\/divContent>/<\/div>/g' \
        -e 's/<divDescription([^>]*)>/<p\1>/g' \
        -e 's/<\/divDescription>/<\/p>/g' \
        -e 's/<divList([^>]*)>/<div\1>/g' \
        -e 's/<\/divList>/<\/div>/g' \
        -e 's/<divTrigger([^>]*)>/<button\1>/g' \
        -e 's/<\/divTrigger>/<\/button>/g' \
        -e 's/ variant="([^"]*)"/ className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"/g' \
        -e 's/ variant="outline"/ className="px-2 py-1 border border-gray-300 rounded-md text-gray-700"/g' \
        -e 's/ variant="default"/ className="px-2 py-1 bg-blue-600 text-white rounded-md"/g' \
        -e 's/ variant="secondary"/ className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md"/g' \
        -e 's/ variant="destructive"/ className="px-2 py-1 bg-red-600 text-white rounded-md"/g' \
        -e 's/ size="sm"/ className="px-3 py-1 text-sm"/g' \
        -e 's/ size="lg"/ className="px-6 py-3 text-lg"/g' \
        "$file" > "$temp_file"
    
    # Replace original with fixed version
    mv "$temp_file" "$file"
    
    print_success "Fixed: $file"
}

# Fix all files
for file in $PROBLEMATIC_FILES; do
    fix_file "$file"
done

# Step 5: Remove comment lines that reference these elements
print_status "Step 5: Cleaning up comment references..."

for file in $PROBLEMATIC_FILES; do
    # Remove comment lines that reference the problematic elements
    sed -i '' '/\/\/ divContent will be imported above/d' "$file"
    sed -i '' '/\/\/ divHeader will be imported above/d' "$file"
    sed -i '' '/\/\/ divTitle will be imported above/d' "$file"
    sed -i '' '/\/\/ divDescription will be imported above/d' "$file"
    sed -i '' '/\/\/ divList will be imported above/d' "$file"
    sed -i '' '/\/\/ divTrigger will be imported above/d' "$file"
    sed -i '' '/\/\/ div will be imported above/d' "$file"
    sed -i '' '/\/\/ button will be imported above/d' "$file"
    sed -i '' '/\/\/ span will be imported above/d' "$file"
done

print_success "Comment cleanup completed"

# Step 6: Verify fixes
print_status "Step 6: Verifying fixes..."

# Check if any problematic elements remain
REMAINING_ISSUES=$(find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "divHeader\|divTitle\|divContent\|divDescription\|divList\|divTrigger" 2>/dev/null)

if [ -z "$REMAINING_ISSUES" ]; then
    print_success "All JSX.IntrinsicElements issues have been fixed!"
else
    print_warning "Some issues may remain in:"
    echo "$REMAINING_ISSUES"
fi

# Step 7: Run ESLint to check for other issues
print_status "Step 7: Running ESLint to check for other issues..."

if command -v npx &> /dev/null; then
    npx eslint . --ext .ts,.tsx --max-warnings 0 || {
        print_warning "ESLint found some issues. Consider fixing them manually."
    }
else
    print_warning "ESLint not available. Skipping linting step."
fi

# Step 8: Summary
echo ""
print_success "Bug fix process completed!"
echo ""
echo "📊 Summary:"
echo "  - Files processed: $(echo "$PROBLEMATIC_FILES" | wc -w | tr -d ' ')"
echo "  - Backup location: $BACKUP_DIR"
echo "  - Issues fixed: JSX.IntrinsicElements mismatches"
echo ""
echo "🔧 Next steps:"
echo "  1. Test the application: npm run dev"
echo "  2. Run build: npm run build"
echo "  3. If issues remain, check the backup directory"
echo ""
echo "💡 If you need to restore original files:"
echo "  cp $BACKUP_DIR/* ./"
echo ""

