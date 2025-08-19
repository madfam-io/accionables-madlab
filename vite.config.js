import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  root: '.',
  base: './',
  
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['./js/utils/helpers.js'],
          'components': [
            './js/components/TaskManager.js',
            './js/components/ResponsiveManager.js',
            './js/components/ThemeManager.js',
            './js/components/LanguageManager.js'
          ],
          'data': ['./js/data/tasks.js', './js/data/translations.js']
        }
      }
    },
    
    // Terser options for production
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  
  // Asset optimization
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf'],
  
  // Plugins
  plugins: [
    // Legacy browser support
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  
  // Module resolution
  resolve: {
    alias: {
      '@': './js',
      '@components': './js/components',
      '@utils': './js/utils',
      '@data': './js/data',
      '@css': './css'
    }
  },
  
  // Optimization
  optimizeDeps: {
    include: [],
    exclude: []
  },
  
  // Environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __VERSION__: JSON.stringify(process.env.npm_package_version)
  }
});