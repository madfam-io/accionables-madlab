#!/bin/bash

# CSS Build Script for MADLAB
# Concatenates modular CSS files into a single optimized file
# Eliminates @import cascade dependencies for reliable loading

echo "🔨 Building CSS for MADLAB..."

# Change to CSS directory
cd "$(dirname "$0")"

# Create header comment for built file
cat > index.built.css << 'EOF'
/**
 * MADLAB - Built CSS File
 * Generated automatically from modular CSS files
 * DO NOT EDIT DIRECTLY - Edit source files instead
 * 
 * Build Date: $(date)
 * Build Source: Concatenated from variables.css, themes.css, base.css, components/*.css
 */

EOF

# Concatenate files in correct order (same as index.css imports)
echo "📁 Concatenating CSS files..."

# Base Styles (Variables, Themes, Base)
cat variables.css >> index.built.css
echo "" >> index.built.css
cat themes.css >> index.built.css  
echo "" >> index.built.css
cat base.css >> index.built.css
echo "" >> index.built.css

# Component Styles (in dependency order)
for component in header buttons theme-switcher hero stats forms phases tasks team tooltip modal; do
    if [ -f "components/${component}.css" ]; then
        echo "  ➜ Adding components/${component}.css"
        cat "components/${component}.css" >> index.built.css
        echo "" >> index.built.css
    fi
done

# Get file size for reporting
size=$(wc -c < index.built.css)
lines=$(wc -l < index.built.css)

echo "✅ CSS build complete!"
echo "   📄 File: index.built.css"
echo "   📊 Size: ${size} bytes"
echo "   📝 Lines: ${lines}"
echo ""
echo "🚀 Ready for deployment - single HTTP request, no @import dependencies"