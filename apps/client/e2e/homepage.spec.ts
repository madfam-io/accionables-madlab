import { test, expect } from '@playwright/test';

test.describe('MADLAB Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    // Check if the main heading is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check if the header contains MADLAB
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText('MADLAB');
  });

  test('should have proper page title', async ({ page }) => {
    await expect(page).toHaveTitle(/MADLAB/i);
  });

  test('should display the team summary section', async ({ page }) => {
    // Team summary should be visible
    await expect(page.getByText(/Resumen del Equipo|Team Summary/i)).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(heading).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(heading).toBeVisible();
  });
});
