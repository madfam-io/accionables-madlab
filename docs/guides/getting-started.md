# Getting Started

Complete guide to setting up and running the MADLAB application for development.

## 📋 Prerequisites

### System Requirements
- **Node.js**: 16.0 or higher (Latest LTS recommended)
- **Package Manager**: npm (comes with Node.js) or yarn
- **Git**: For version control
- **Editor**: VS Code recommended

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🚀 Installation

### 1. Clone the Repository
```bash
# Using HTTPS
git clone https://github.com/your-org/accionables-madlab.git

# Using SSH
git clone git@github.com:your-org/accionables-madlab.git

# Navigate to project directory
cd accionables-madlab
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Verify Installation
```bash
# Check Node.js version
node --version  # Should be 16+

# Check npm version
npm --version   # Should be 8+

# Verify dependencies
npm list --depth=0
```

## 🏃‍♂️ Running the Application

### Development Server
```bash
# Start development server
npm run dev

# Server will start on http://localhost:5173
# Hot Module Replacement (HMR) enabled
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
# Preview available at http://localhost:4173
```

### Development Scripts
```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🛠️ Development Environment Setup

### VS Code Configuration

#### Recommended Extensions
Create `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["classNames\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

#### Debug Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Git Configuration

#### Git Hooks Setup
```bash
# Optional: Set up pre-commit hooks
npx husky install
npx husky add .husky/pre-commit "npm run lint"
```

#### Git Ignore
The project includes comprehensive `.gitignore`:
```gitignore
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment files
.env
.env.local
.env.production

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db
```

## 📁 Project Structure Overview

```
accionables-madlab/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── data/              # Static data and types
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Zustand state stores
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── docs/                   # Documentation
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── README.md             # Project overview
```

## 🔧 Configuration Files

### TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'state-vendor': ['zustand'],
          'utils': ['lucide-react']
        }
      }
    }
  }
})
```

### Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'bounce-soft': 'bounce 1s ease-in-out'
      }
    },
  },
  plugins: [],
}
```

## 🧪 Testing Setup

### Running Tests
```bash
# Install testing dependencies (if adding tests)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

### Test Configuration
Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 5173
lsof -i :5173

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

#### TypeScript Errors
```bash
# Clear TypeScript cache
npx tsc --build --clean

# Restart TypeScript service in VS Code
Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Failures
```bash
# Clear build cache
rm -rf dist/

# Rebuild
npm run build
```

### Performance Issues

#### Slow Development Server
```bash
# Check for large files in src/
du -sh src/*

# Optimize imports
# Use tree-shaking friendly imports
import { Button } from './components/Button'  // Good
import * as Components from './components'     // Avoid
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## 📊 Development Metrics

### Build Performance
```bash
# Analyze bundle size
npm run build
npm run preview

# Check build output
ls -la dist/
```

### Development Experience
- **Hot Reload**: < 50ms update time
- **TypeScript Checking**: Real-time in IDE
- **Build Time**: < 30 seconds
- **Bundle Size**: < 300KB gzipped

## 🎯 Next Steps

After setup completion:

1. **Explore the Application**: Visit http://localhost:5173
2. **Review Documentation**: Read [Architecture](../architecture/README.md)
3. **Study Components**: Examine [Component Library](../components/README.md)
4. **Understand State**: Review [API Documentation](../api/README.md)
5. **Follow Workflow**: Check [Development Workflow](./development-workflow.md)

## 🤝 Getting Help

If you encounter issues:

1. **Check Documentation**: Most common issues are documented
2. **Search Issues**: Look through existing GitHub issues
3. **Create Issue**: Submit detailed bug report
4. **Ask for Help**: Reach out to team members

Remember: The development environment should "just work" - if it doesn't, it's a bug that should be fixed!