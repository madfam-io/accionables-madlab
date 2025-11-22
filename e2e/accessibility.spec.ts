import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for h1
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Check that there's only one h1
    const h1Count = await page.getByRole('heading', { level: 1 }).count();
    expect(h1Count).toBe(1);
  });

  test('should have accessible buttons', async ({ page }) => {
    // All buttons should have accessible names
    const buttons = await page.getByRole('button').all();

    for (const button of buttons) {
      const accessibleName = await button.getAttribute('aria-label') || await button.textContent();
      expect(accessibleName).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Start at the top
    await page.keyboard.press('Tab');

    // Get the focused element
    const firstFocusable = await page.evaluate(() => document.activeElement?.tagName);

    // Should focus on an interactive element
    expect(['BUTTON', 'A', 'INPUT', 'SELECT']).toContain(firstFocusable || '');

    // Should be able to tab through elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? { tag: el.tagName, visible: el.checkVisibility() } : null;
      });

      // Focused element should be visible
      if (focused) {
        expect(focused.visible).toBe(true);
      }
    }
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    // Progress bars should have proper role and attributes
    const progressBars = page.locator('[role="progressbar"]');
    const count = await progressBars.count();

    if (count > 0) {
      const firstProgressBar = progressBars.first();
      await expect(firstProgressBar).toHaveAttribute('aria-valuenow');
      await expect(firstProgressBar).toHaveAttribute('aria-valuemin');
      await expect(firstProgressBar).toHaveAttribute('aria-valuemax');
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    // This is a basic test - for comprehensive contrast testing, use axe-core
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    // Ensure background color is set
    expect(backgroundColor).toBeTruthy();
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should have language attribute', async ({ page }) => {
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');

    // Should have lang attribute set
    expect(lang).toBeTruthy();
    expect(['es', 'en', 'es-ES', 'en-US']).toContain(lang || '');
  });

  test('should have descriptive link text', async ({ page }) => {
    const links = await page.getByRole('link').all();

    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      // Link should have either text content or aria-label
      const hasDescription = (text && text.trim().length > 0) || (ariaLabel && ariaLabel.trim().length > 0);
      expect(hasDescription).toBe(true);
    }
  });
});
