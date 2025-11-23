# Deployment Automation Guide

Complete guide to automating MADLAB deployment with CI/CD pipelines and best practices.

## Table of Contents

1. [Overview](#overview)
2. [GitHub Actions CI/CD](#github-actions-cicd)
3. [Vercel Deployment](#vercel-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Automated Testing](#automated-testing)
6. [Release Management](#release-management)
7. [Monitoring & Alerts](#monitoring--alerts)

---

## Overview

MADLAB uses a fully automated CI/CD pipeline that:
- ✅ Runs tests on every push
- ✅ Performs accessibility audits
- ✅ Builds and optimizes production bundles
- ✅ Deploys to Vercel automatically
- ✅ Creates preview deployments for PRs
- ✅ Monitors performance metrics

**Deployment Flow**:
```
git push → GitHub Actions → Tests → Build → Deploy to Vercel → Monitor
```

---

## GitHub Actions CI/CD

### Current Pipeline

**Location**: `.github/workflows/ci.yml`

**Jobs**:
1. **Lint** - ESLint and TypeScript checking
2. **Test** - Unit tests with coverage
3. **E2E** - End-to-end tests with Playwright
4. **Build** - Production build
5. **Deploy Preview** - PR preview deployments
6. **Deploy Production** - Main branch deployment

### Complete CI/CD Configuration

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop, 'claude/**']
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    name: Lint & Format Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check TypeScript
        run: npm run type-check
        continue-on-error: true

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --run

      - name: Generate coverage report
        run: npm run test:coverage -- --run
        continue-on-error: true

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        if: always()
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
        continue-on-error: true

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Check build size
        run: |
          echo "Build size:" && du -sh dist/
          echo "Detailed breakdown:" && du -sh dist/*

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          retention-days: 7

  deploy-preview:
    name: Deploy Preview (Vercel)
    runs-on: ubuntu-latest
    needs: [build, e2e]
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Deploy to Vercel (Preview)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
        continue-on-error: true

  deploy-production:
    name: Deploy to Production (Vercel)
    runs-on: ubuntu-latest
    needs: [build, e2e]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production
    steps:
      - uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./
        continue-on-error: true
```

### Additional Workflows

#### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Serve
        run: npx serve -s dist -l 5000 &

      - name: Wait for server
        run: npx wait-on http://localhost:5000

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: http://localhost:5000
          uploadArtifacts: true
          temporaryPublicStorage: true
          budgetPath: ./lighthouse-budget.json

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'Lighthouse CI results available!'
            })
```

#### Dependency Updates

```yaml
# .github/workflows/dependency-review.yml
name: Dependency Review

on: [pull_request]

permissions:
  contents: read

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Dependency Review
        uses: actions/dependency-review-action@v3
        with:
          fail-on-severity: moderate
          deny-licenses: GPL-3.0, AGPL-3.0
```

---

## Vercel Deployment

### Setup Vercel Project

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Deploy manually
vercel --prod
```

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "env": {
    "NODE_VERSION": "20"
  }
}
```

### Environment Variables

**Vercel Dashboard** → Project Settings → Environment Variables:

```bash
# Production
VITE_APP_ENV=production
VITE_API_URL=https://api.madlab.io
VITE_ENABLE_ANALYTICS=true

# Preview
VITE_APP_ENV=preview
VITE_API_URL=https://api-preview.madlab.io
VITE_ENABLE_ANALYTICS=false

# Development
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
```

### Deployment Hooks

```bash
# Deploy on Git push (automatic)
git push origin main

# Deploy specific branch
vercel --prod --scope=team-name

# Deploy with custom domain
vercel --prod --alias=madlab.app

# Rollback to previous deployment
vercel rollback
```

---

## Environment Configuration

### Environment Files

```bash
# .env.local (not committed)
VITE_APP_ENV=local
VITE_API_URL=http://localhost:3000

# .env.development
VITE_APP_ENV=development
VITE_ENABLE_DEBUG=true

# .env.production
VITE_APP_ENV=production
VITE_ENABLE_DEBUG=false
```

### Using Environment Variables

```tsx
// src/config/env.ts
export const config = {
  env: import.meta.env.VITE_APP_ENV || 'development',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Usage in components
import { config } from './config/env';

if (config.enableAnalytics) {
  trackEvent('page_view');
}
```

---

## Automated Testing

### Pre-deployment Tests

```bash
# Run all tests before deployment
npm run test:all

# Test script in package.json
"scripts": {
  "test:all": "npm run lint && npm run type-check && npm test -- --run && npm run test:e2e",
  "test:ci": "npm run test:all && npm run build"
}
```

### Test Coverage Requirements

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

**CI will fail if coverage falls below 80%**

### Visual Regression Testing

```bash
# Install Percy
npm install -D @percy/cli @percy/playwright

# Add to E2E tests
import percySnapshot from '@percy/playwright';

test('visual regression', async ({ page }) => {
  await page.goto('/');
  await percySnapshot(page, 'Homepage');
});

# Run with Percy
npx percy exec -- npx playwright test
```

---

## Release Management

### Semantic Versioning

```bash
# Install standard-version
npm install -D standard-version

# Add scripts to package.json
"scripts": {
  "release": "standard-version",
  "release:minor": "standard-version --release-as minor",
  "release:major": "standard-version --release-as major"
}

# Create release
npm run release

# Push tags
git push --follow-tags origin main
```

### Changelog Generation

```bash
# .versionrc
{
  "types": [
    { "type": "feat", "section": "Features" },
    { "type": "fix", "section": "Bug Fixes" },
    { "type": "chore", "hidden": true },
    { "type": "docs", "section": "Documentation" },
    { "type": "style", "hidden": true },
    { "type": "refactor", "section": "Refactoring" },
    { "type": "perf", "section": "Performance" },
    { "type": "test", "hidden": true }
  ]
}
```

### GitHub Releases

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body_path: ./CHANGELOG.md
          draft: false
          prerelease: false
```

---

## Monitoring & Alerts

### Error Tracking with Sentry

```bash
# Install Sentry
npm install @sentry/react @sentry/vite-plugin

# Configure Sentry
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});
```

### Performance Monitoring

```tsx
// Track performance metrics
import { onCLS, onFID, onLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);
  // Send to your analytics service
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
```

### Uptime Monitoring

**Configure in Vercel**:
1. Integrations → Monitoring
2. Enable Uptime Monitoring
3. Set check interval (1 minute)
4. Configure alerts

**Or use external services**:
- UptimeRobot
- Pingdom
- StatusCake

### Deployment Notifications

```yaml
# .github/workflows/notify.yml
name: Deployment Notification

on:
  deployment_status:

jobs:
  notify:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - name: Send Slack notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to ${{ github.event.deployment.environment }} succeeded!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Build successful locally
- [ ] No console errors or warnings

### Deployment
- [ ] Deploy to preview environment
- [ ] QA testing on preview
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile device testing

### Post-Deployment
- [ ] Verify production deployment
- [ ] Check error monitoring (Sentry)
- [ ] Monitor performance metrics
- [ ] Test critical user flows
- [ ] Verify analytics tracking
- [ ] Update changelog

---

## Rollback Procedures

### Quick Rollback

```bash
# Via Vercel CLI
vercel rollback

# Via Vercel Dashboard
# Deployments → Click previous deployment → Promote to Production
```

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# CI/CD will automatically deploy the reverted version
```

### Database Rollback

```bash
# If using migrations
npm run db:rollback

# Restore from backup
# (depends on your database setup)
```

---

## Best Practices

### 1. Deployment Strategy

- **Blue-Green Deployment**: Zero-downtime deployments
- **Canary Releases**: Gradual rollout to subset of users
- **Feature Flags**: Toggle features without deploying

### 2. Security

- Never commit secrets to Git
- Use environment variables for sensitive data
- Enable branch protection rules
- Require code reviews
- Use Dependabot for security updates

### 3. Performance

- Enable caching headers
- Use CDN for static assets
- Compress responses (gzip/brotli)
- Optimize images
- Monitor bundle size

### 4. Monitoring

- Track error rates
- Monitor performance metrics
- Set up alerts for critical issues
- Review logs regularly
- Maintain status page

---

## Troubleshooting

### Common Issues

**Build Fails**:
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Tests Fail in CI**:
```bash
# Run tests locally with same conditions
CI=true npm test -- --run
```

**Deployment Hangs**:
```bash
# Check Vercel status
https://www.vercel-status.com/

# Cancel and redeploy
vercel --force
```

---

## Additional Resources

### Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

### Tools
- [Vercel CLI](https://vercel.com/cli)
- [GitHub CLI](https://cli.github.com/)
- [Standard Version](https://github.com/conventional-changelog/standard-version)

---

**Last Updated**: November 22, 2024
**Deployment Method**: Vercel (Automated)
**Average Deploy Time**: ~2 minutes

*Fully automated, zero-downtime deployments with comprehensive monitoring*
