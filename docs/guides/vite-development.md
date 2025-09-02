# MADLAB SPA - Vite Development Setup

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code analysis |
| `npm run format` | Format code with Prettier |

## 📁 Project Structure

```
├── js/                    # Source JavaScript
│   ├── components/        # Component classes
│   ├── data/             # Static data and translations
│   ├── state/            # State management
│   └── utils/            # Utility functions
├── css/                  # Stylesheets
├── dist/                 # Build output (generated)
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## ⚡ Vite Features Enabled

- **Hot Module Replacement (HMR)** - Instant updates during development
- **Tree Shaking** - Remove unused code from bundle
- **Code Splitting** - Separate chunks for better caching
- **Legacy Browser Support** - Automatic polyfills for older browsers
- **CSS Preprocessing** - Enhanced CSS processing
- **Asset Optimization** - Automatic image and font optimization

## 🔧 Configuration

### Vite Config (`vite.config.js`)
- Development server on port 3000
- Automatic chunk splitting
- Legacy browser support
- Source maps for debugging
- Terser minification for production

### Code Quality
- **ESLint** - Code linting and error detection
- **Prettier** - Consistent code formatting
- **Modern JS** - ES2022+ features enabled

## 📊 Performance Optimizations

### Bundle Splitting
- `vendor` - Utility functions
- `components` - UI components
- `data` - Static data files

### Production Optimizations
- Minification with Terser
- Dead code elimination
- Asset compression
- Source map generation

## 🌐 Browser Support

- Modern browsers (ES2022+)
- Legacy support via Vite Legacy plugin
- Automatic polyfill injection

## 🔍 Development Tips

### HMR (Hot Module Replacement)
Changes to components automatically update without page refresh.

### Debugging
Source maps available in development for easy debugging.

### Performance Monitoring
Use browser dev tools to analyze bundle size and performance.

## 🚨 Migration Notes

This setup replaces the previous HTTP server approach with a modern Vite-based development environment while maintaining full backward compatibility with the existing codebase structure.