# MADLAB CSS Build System

Elegant dynamic CSS solution that maintains modular development while solving FOUC issues.

## Usage

### For Development (Recommended)
```bash
# Use modular CSS with @imports (current HTML setup)
npm run dev
# Vite handles CSS processing automatically
```

### For Production Optimization
```bash
# Option 1: Auto-builder (watches for changes)
npm run css:watch
# Runs in background, rebuilds on any CSS file change

# Option 2: One-time build
npm run css:build

# Option 3: Manual build (bash script)
npm run css:manual
```

### Switch to Built CSS
To use the optimized single-file CSS:

1. In `index.html`, comment/uncomment the CSS links:
```html
<!-- Development: Modular CSS -->
<!-- <link rel="stylesheet" href="css/index.css" data-css-mode="development"> -->

<!-- Production: Built CSS -->
<link rel="stylesheet" href="css/index.built.css" data-css-mode="production">
```

## Files

- **`index.css`** - Main entry point with @imports (development)
- **`index.built.css`** - Auto-generated concatenated file (production)
- **`auto-build.js`** - Smart file watcher and builder
- **`build-css.sh`** - Simple bash concatenation script
- **`critical.css`** - Minimal inline styles for FOUC prevention

## How It Works

1. **Development**: Edit modular files in `components/`
2. **Auto-rebuild**: File watcher detects changes and rebuilds instantly
3. **Production**: Single HTTP request, no @import cascade
4. **Best of both worlds**: Modular development + optimized delivery

## Build Order

The auto-builder concatenates files in dependency order:
1. `variables.css` - CSS custom properties
2. `themes.css` - Theme system
3. `base.css` - Base styles and utilities
4. `components/*.css` - Component styles

## Benefits

- ✅ **Zero manual work** - Auto-rebuilds on file changes
- ✅ **Modular development** - Edit individual component files  
- ✅ **Production optimized** - Single file, no @import cascade
- ✅ **FOUC prevention** - Critical CSS inlined for instant render
- ✅ **Clean architecture** - No code smells, proper separation