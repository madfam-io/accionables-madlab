#!/usr/bin/env node

/**
 * MADLAB CSS Auto-Builder
 * Elegant solution for dynamic CSS concatenation
 * Watches CSS files and rebuilds automatically on changes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CSSAutoBuilder {
    constructor() {
        this.isBuilding = false;
        this.buildQueue = false;
        this.watchers = new Map();
        
        // CSS build order (same as index.css imports)
        this.buildOrder = [
            'variables.css',
            'themes.css', 
            'base.css',
            'components/header.css',
            'components/buttons.css',
            'components/theme-switcher.css',
            'components/hero.css',
            'components/stats.css',
            'components/forms.css',
            'components/phases.css',
            'components/tasks.css',
            'components/team.css',
            'components/tooltip.css',
            'components/modal.css'
        ];
    }

    async build() {
        if (this.isBuilding) {
            this.buildQueue = true;
            return;
        }

        this.isBuilding = true;
        console.log('🔨 Building CSS...');

        try {
            const header = `/**
 * MADLAB - Auto-Built CSS File
 * Generated automatically on ${new Date().toISOString()}
 * DO NOT EDIT DIRECTLY - Edit source files instead
 */

`;

            let cssContent = header;

            // Concatenate files in order
            for (const file of this.buildOrder) {
                const filePath = path.join(__dirname, file);
                
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    cssContent += `/* === ${file} === */\n`;
                    cssContent += content;
                    cssContent += '\n\n';
                }
            }

            // Write built file
            const outputPath = path.join(__dirname, 'index.built.css');
            fs.writeFileSync(outputPath, cssContent);

            const size = Math.round(fs.statSync(outputPath).size / 1024);
            console.log(`✅ CSS built successfully (${size}KB)`);

        } catch (error) {
            console.error('❌ CSS build failed:', error.message);
        } finally {
            this.isBuilding = false;
            
            // Process queued build if needed
            if (this.buildQueue) {
                this.buildQueue = false;
                setTimeout(() => this.build(), 100);
            }
        }
    }

    watch() {
        const watchPaths = [
            __dirname,
            path.join(__dirname, 'components')
        ];

        watchPaths.forEach(watchPath => {
            if (!fs.existsSync(watchPath)) return;

            // Simple polling watcher (Node.js built-in)
            fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
                if (!filename || !filename.endsWith('.css')) return;
                if (filename === 'index.built.css') return; // Skip our output file
                
                console.log(`📁 CSS file changed: ${filename}`);
                this.build();
            });
        });

        console.log('👀 Watching CSS files for changes...');
        console.log('📂 Watched directories:', watchPaths);
    }

    async start() {
        console.log('🚀 MADLAB CSS Auto-Builder starting...');
        
        // Initial build
        await this.build();
        
        // Start watching
        this.watch();
        
        console.log('✨ Auto-builder ready! Edit any CSS file to trigger rebuild.');
    }
}

// Start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const builder = new CSSAutoBuilder();
    builder.start().catch(console.error);
}

export default CSSAutoBuilder;