#!/bin/bash

# 🔧 Fix Duplicate Props Script for WeddingLK
# This script fixes all duplicate props errors found by ESLint

echo "🔧 Starting duplicate props fix..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

# Function to fix duplicate props in a file
fix_duplicate_props() {
    local file="$1"
    print_status "Fixing duplicate props in: $file"
    
    # Create temporary file
    local temp_file="${file}.tmp"
    
    # Fix common duplicate props patterns
    sed -E \
        -e 's/(className="[^"]*") (className="[^"]*")/\1/g' \
        -e 's/(className="[^"]*") (className="[^"]*")/\1/g' \
        -e 's/(variant="[^"]*") (variant="[^"]*")/\1/g' \
        -e 's/(size="[^"]*") (size="[^"]*")/\1/g' \
        -e 's/(type="[^"]*") (type="[^"]*")/\1/g' \
        -e 's/(id="[^"]*") (id="[^"]*")/\1/g' \
        -e 's/(name="[^"]*") (name="[^"]*")/\1/g' \
        -e 's/(value="[^"]*") (value="[^"]*")/\1/g' \
        -e 's/(placeholder="[^"]*") (placeholder="[^"]*")/\1/g' \
        -e 's/(checked="[^"]*") (checked="[^"]*")/\1/g' \
        -e 's/(disabled="[^"]*") (disabled="[^"]*")/\1/g' \
        -e 's/(required="[^"]*") (required="[^"]*")/\1/g' \
        -e 's/(readonly="[^"]*") (readonly="[^"]*")/\1/g' \
        -e 's/(maxlength="[^"]*") (maxlength="[^"]*")/\1/g' \
        -e 's/(minlength="[^"]*") (minlength="[^"]*")/\1/g' \
        -e 's/(max="[^"]*") (max="[^"]*")/\1/g' \
        -e 's/(min="[^"]*") (min="[^"]*")/\1/g' \
        -e 's/(step="[^"]*") (step="[^"]*")/\1/g' \
        -e 's/(pattern="[^"]*") (pattern="[^"]*")/\1/g' \
        -e 's/(autocomplete="[^"]*") (autocomplete="[^"]*")/\1/g' \
        -e 's/(autofocus="[^"]*") (autofocus="[^"]*")/\1/g' \
        -e 's/(form="[^"]*") (form="[^"]*")/\1/g' \
        -e 's/(formaction="[^"]*") (formaction="[^"]*")/\1/g' \
        -e 's/(formenctype="[^"]*") (formenctype="[^"]*")/\1/g' \
        -e 's/(formmethod="[^"]*") (formmethod="[^"]*")/\1/g' \
        -e 's/(formnovalidate="[^"]*") (formnovalidate="[^"]*")/\1/g' \
        -e 's/(formtarget="[^"]*") (formtarget="[^"]*")/\1/g' \
        -e 's/(list="[^"]*") (list="[^"]*")/\1/g' \
        -e 's/(multiple="[^"]*") (multiple="[^"]*")/\1/g' \
        -e 's/(selected="[^"]*") (selected="[^"]*")/\1/g' \
        -e 's/(src="[^"]*") (src="[^"]*")/\1/g' \
        -e 's/(alt="[^"]*") (alt="[^"]*")/\1/g' \
        -e 's/(title="[^"]*") (title="[^"]*")/\1/g' \
        -e 's/(href="[^"]*") (href="[^"]*")/\1/g' \
        -e 's/(target="[^"]*") (target="[^"]*")/\1/g' \
        -e 's/(rel="[^"]*") (rel="[^"]*")/\1/g' \
        -e 's/(download="[^"]*") (download="[^"]*")/\1/g' \
        -e 's/(hreflang="[^"]*") (hreflang="[^"]*")/\1/g' \
        -e 's/(media="[^"]*") (media="[^"]*")/\1/g' \
        -e 's/(ping="[^"]*") (ping="[^"]*")/\1/g' \
        -e 's/(referrerpolicy="[^"]*") (referrerpolicy="[^"]*")/\1/g' \
        -e 's/(usemap="[^"]*") (usemap="[^"]*")/\1/g' \
        -e 's/(width="[^"]*") (width="[^"]*")/\1/g' \
        -e 's/(height="[^"]*") (height="[^"]*")/\1/g' \
        -e 's/(loading="[^"]*") (loading="[^"]*")/\1/g' \
        -e 's/(decoding="[^"]*") (decoding="[^"]*")/\1/g' \
        -e 's/(ismap="[^"]*") (ismap="[^"]*")/\1/g' \
        -e 's/(usemap="[^"]*") (usemap="[^"]*")/\1/g' \
        -e 's/(crossorigin="[^"]*") (crossorigin="[^"]*")/\1/g' \
        -e 's/(integrity="[^"]*") (integrity="[^"]*")/\1/g' \
        -e 's/(fetchpriority="[^"]*") (fetchpriority="[^"]*")/\1/g' \
        -e 's/(sizes="[^"]*") (sizes="[^"]*")/\1/g' \
        -e 's/(srcset="[^"]*") (srcset="[^"]*")/\1/g' \
        -e 's/(type="[^"]*") (type="[^"]*")/\1/g' \
        -e 's/(value="[^"]*") (value="[^"]*")/\1/g' \
        -e 's/(name="[^"]*") (name="[^"]*")/\1/g' \
        -e 's/(id="[^"]*") (id="[^"]*")/\1/g' \
        -e 's/(class="[^"]*") (class="[^"]*")/\1/g' \
        -e 's/(style="[^"]*") (style="[^"]*")/\1/g' \
        -e 's/(data-[^"]*="[^"]*") (data-[^"]*="[^"]*")/\1/g' \
        -e 's/(aria-[^"]*="[^"]*") (aria-[^"]*="[^"]*")/\1/g' \
        "$file" > "$temp_file"
    
    # Replace original with fixed version
    mv "$temp_file" "$file"
    
    print_success "Fixed: $file"
}

# Get list of files with duplicate props errors
print_status "Scanning for files with duplicate props..."

# Run ESLint to get the list of files with errors
ESLINT_OUTPUT=$(npx eslint . --ext .ts,.tsx --format=compact 2>/dev/null | grep "duplicate props" | cut -d: -f1 | sort -u)

if [ -z "$ESLINT_OUTPUT" ]; then
    print_success "No duplicate props errors found!"
    exit 0
fi

echo "Files with duplicate props errors:"
echo "$ESLINT_OUTPUT"
echo ""

# Fix each file
print_status "Fixing duplicate props in all files..."
for file in $ESLINT_OUTPUT; do
    if [ -f "$file" ]; then
        fix_duplicate_props "$file"
    fi
done

# Verify fixes
print_status "Verifying fixes..."
ESLINT_OUTPUT_AFTER=$(npx eslint . --ext .ts,.tsx --format=compact 2>/dev/null | grep "duplicate props" | wc -l)

if [ "$ESLINT_OUTPUT_AFTER" -eq 0 ]; then
    print_success "All duplicate props errors have been fixed!"
else
    print_warning "Some duplicate props errors may remain. Count: $ESLINT_OUTPUT_AFTER"
fi

echo ""
print_success "Duplicate props fix process completed!"
echo ""
echo "🔧 Next steps:"
echo "  1. Run ESLint again: npx eslint . --ext .ts,.tsx"
echo "  2. Test the application: npm run dev"
echo "  3. Run build: npm run build"
echo ""

