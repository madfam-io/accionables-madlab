import { test, expect } from '@playwright/test';

test.describe('Theme and Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch between themes', async ({ page }) => {
    // Get theme buttons
    const lightButton = page.getByRole('button', { name: /light|claro/i });
    const darkButton = page.getByRole('button', { name: /dark|oscuro/i });

    // Click light theme
    await lightButton.click();

    // Check if light theme is applied (no dark class on html)
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    // Click dark theme
    await darkButton.click();

    // Check if dark theme is applied
    await expect(html).toHaveClass(/dark/);
  });

  test('should switch language from Spanish to English', async ({ page }) => {
    // Initial language is Spanish
    await expect(page.getByText(/Lista de Tareas/i)).toBeVisible();

    // Find and click language button (shows current language)
    const languageButton = page.getByRole('button', { name: /ES|EN/i });
    await languageButton.click();

    // Check if English content is now visible
    await expect(page.getByText(/Task List|MADLAB/i)).toBeVisible();
  });

  test('should persist theme selection across page reload', async ({ page }) => {
    // Set dark theme
    const darkButton = page.getByRole('button', { name: /dark|oscuro/i });
    await darkButton.click();

    // Reload page
    await page.reload();

    // Dark theme should still be active
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });
});
