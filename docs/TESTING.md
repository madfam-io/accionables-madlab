# Testing Guide

## Overview

MADLAB uses a comprehensive testing strategy with multiple testing layers to ensure quality and reliability.

## Testing Stack

### Unit & Integration Testing
- **Framework**: Vitest 4.0
- **React Testing**: React Testing Library 16.3
- **Assertions**: Jest DOM matchers
- **Coverage**: V8 provider

### E2E Testing
- **Framework**: Playwright 1.56
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: iPhone 12, Pixel 5
- **Video**: Recorded on failure

---

## Quick Start

### Installation
```bash
# Install all dependencies
npm install

# Install Playwright browsers
npm run playwright:install
```

### Running Tests
```bash
# Unit tests
npm test                    # Run once
npm run test:watch          # Watch mode
npm run test:ui             # Visual UI
npm run test:coverage       # With coverage

# E2E tests
npm run test:e2e            # Headless
npm run test:e2e:headed     # With browser
npm run test:e2e:ui         # Visual UI
npm run test:e2e:debug      # Debug mode
```

---

## Unit Testing

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from '../Component';

describe('Component', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    render(<Component />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Testing Components

#### Pure Components
```typescript
// src/components/__tests__/ProgressBar.test.tsx
describe('ProgressBar', () => {
  it('should display correct percentage', () => {
    const { container } = render(<ProgressBar value={75} />);
    const fill = container.querySelector('[style*="width"]');

    expect(fill).toHaveStyle({ width: '75%' });
  });

  it('should show label when requested', () => {
    render(<ProgressBar value={60} showLabel={true} />);
    expect(screen.getByText('60%')).toBeInTheDocument();
  });
});
```

#### Interactive Components
```typescript
// src/components/__tests__/Header.test.tsx
describe('Header', () => {
  it('should toggle language', () => {
    render(<Header />);
    const langButton = screen.getByText('ES');

    fireEvent.click(langButton);

    expect(useAppStore.getState().language).toBe('en');
  });
});
```

### Testing Utilities

```typescript
// src/utils/__tests__/dateHelpers.test.tsx
describe('dateHelpers', () => {
  it('should calculate ISO week correctly', () => {
    const date = new Date(2025, 7, 11);
    expect(getISOWeek(date)).toBe(33);
  });

  it('should handle edge cases', () => {
    const jan1 = new Date(2025, 0, 1);
    const week = getISOWeek(jan1);

    expect(week).toBeGreaterThan(0);
    expect(week).toBeLessThan(54);
  });
});
```

### Testing Hooks

```typescript
import { renderHook } from '@testing-library/react';

describe('useCustomHook', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current).toBe(initialValue);
  });

  it('should update value', () => {
    const { result } = renderHook(() => useCustomHook());

    act(() => {
      result.current.update('new value');
    });

    expect(result.current.value).toBe('new value');
  });
});
```

---

## E2E Testing

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform action', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: 'Submit' });

    // Act
    await button.click();

    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Page Object Model

```typescript
// e2e/pages/HomePage.ts
export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async searchTasks(query: string) {
    await this.page.getByPlaceholder(/search/i).fill(query);
  }

  async getTaskCount() {
    return this.page.locator('.task-card').count();
  }
}

// Usage in test
test('should search tasks', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.searchTasks('LeanTime');

  const count = await homePage.getTaskCount();
  expect(count).toBeGreaterThan(0);
});
```

### Common Patterns

#### Waiting for Elements
```typescript
// Wait for element to be visible
await expect(page.getByText('Loading...')).toBeVisible();
await expect(page.getByText('Loading...')).toBeHidden();

// Wait for network
await page.waitForLoadState('networkidle');

// Wait for specific event
await page.waitForEvent('response', response =>
  response.url().includes('/api/tasks')
);
```

#### Testing Forms
```typescript
test('should submit form', async ({ page }) => {
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Login successful')).toBeVisible();
});
```

#### Testing Downloads
```typescript
test('should download file', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('tasks.csv');
});
```

---

## Coverage

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
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

### Running Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Goals

| Type | Current | Target |
|------|---------|--------|
| Statements | 79+ tests | 80% |
| Branches | Partial | 80% |
| Functions | Partial | 80% |
| Lines | Partial | 80% |

---

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Push to claude/** branches

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test -- --run
      - run: npm run test:coverage

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

### Pre-commit Hooks (Optional)

```bash
# Install husky
npm install -D husky lint-staged

# Setup pre-commit
npx husky init

# .husky/pre-commit
npm test -- --run
```

---

## Best Practices

### Do's ✅
- Write tests before fixing bugs (TDD)
- Test user behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Keep tests independent and isolated
- Use descriptive test names
- Test edge cases and error states
- Mock external dependencies
- Clean up after tests

### Don'ts ❌
- Don't test implementation details
- Don't use brittle selectors (.class-123)
- Don't make tests depend on each other
- Don't skip cleanup
- Don't test third-party libraries
- Don't use timeouts instead of proper waits
- Don't ignore failing tests

### Test Naming

```typescript
// Good: Descriptive, clear intent
it('should display error message when email is invalid', () => {});

// Bad: Vague, unclear
it('should work', () => {});
it('test 1', () => {});
```

---

## Debugging Tests

### Vitest Debugging

```typescript
import { expect, vi } from 'vitest';

// Console logging
console.log(screen.debug());

// Breakpoints (run with --inspect)
debugger;

// Mock functions
const mockFn = vi.fn();
expect(mockFn).toHaveBeenCalledWith('arg');
```

### Playwright Debugging

```bash
# Debug mode (step through)
npm run test:e2e:debug

# Headed mode (see browser)
npm run test:e2e:headed

# Slow motion
npm run test:e2e -- --slowMo=1000
```

```typescript
// Pause execution
await page.pause();

// Screenshot
await page.screenshot({ path: 'screenshot.png' });

// Trace
await page.context().tracing.start({ screenshots: true, snapshots: true });
```

---

## Test Data

### Factories

```typescript
// test/factories/taskFactory.ts
export const createTask = (overrides = {}): Task => ({
  id: 'test-1',
  name: 'Test Task',
  nameEn: 'Test Task',
  assignee: 'Aldo',
  hours: 10,
  difficulty: 3,
  phase: 1,
  section: 'Test Section',
  sectionEn: 'Test Section',
  dependencies: [],
  ...overrides,
});

// Usage
const task = createTask({ hours: 20, difficulty: 5 });
```

### Mocks

```typescript
// Mock zustand store
vi.mock('../stores/appStore', () => ({
  useAppStore: vi.fn(() => ({
    theme: 'light',
    setTheme: vi.fn(),
  })),
}));

// Mock API calls
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: mockData })),
  },
}));
```

---

## Performance Testing

### Bundle Size

```bash
# Analyze bundle
npm run build
npm run build:analyze
```

### Lighthouse

```bash
# Run Lighthouse in CI
npx lighthouse http://localhost:5173 --view
```

---

## Resources

### Documentation
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Tools
- [Testing Playground](https://testing-playground.com/)
- [Playwright Trace Viewer](https://trace.playwright.dev/)

---

## Getting Help

- Check existing tests for examples
- Read the error messages carefully
- Use `screen.debug()` to see the DOM
- Ask in team chat/GitHub discussions
- Consult official documentation

Happy Testing! 🧪
