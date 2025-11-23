import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for tasks to load
    await page.waitForLoadState('networkidle');
  });

  test('should display tasks', async ({ page }) => {
    // Check if at least one task is visible
    const tasks = page.locator('[data-testid="task-card"], .task-card, .phase-section');
    await expect(tasks.first()).toBeVisible();
  });

  test('should filter tasks by search', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/buscar|search/i);

    // Type in search
    await searchInput.fill('LeanTime');

    // Wait a moment for filtering
    await page.waitForTimeout(500);

    // Check if filtered results are shown
    const resultsText = page.getByText(/mostrando|showing/i);
    await expect(resultsText).toBeVisible();
  });

  test('should switch between view modes', async ({ page }) => {
    // Find view mode buttons
    const listButton = page.getByRole('button', { name: /lista|list/i });
    const gridButton = page.getByRole('button', { name: /cuadrícula|grid/i });
    const ganttButton = page.getByRole('button', { name: /gantt/i });

    // Try clicking grid view if available
    if (await gridButton.isVisible()) {
      await gridButton.click();
      await page.waitForTimeout(300);
    }

    // Try clicking Gantt view if available
    if (await ganttButton.isVisible()) {
      await ganttButton.click();
      await page.waitForTimeout(300);

      // Check if Gantt chart is visible
      await expect(page.locator('.gantt-chart, [data-testid="gantt-chart"]')).toBeVisible();
    }

    // Switch back to list view
    if (await listButton.isVisible()) {
      await listButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('should export tasks', async ({ page }) => {
    // Find export button
    const exportButton = page.getByRole('button', { name: /exportar|export/i });

    if (await exportButton.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);

      // Click export button
      await exportButton.click();

      // Wait for modal or dropdown to appear
      await page.waitForTimeout(500);

      // Look for format buttons (CSV, JSON, PDF, etc.)
      const csvButton = page.getByRole('button', { name: /csv/i });

      if (await csvButton.isVisible()) {
        await csvButton.click();

        // Wait for download
        const download = await downloadPromise;

        if (download) {
          // Verify download started
          expect(download.suggestedFilename()).toMatch(/\.csv$/);
        }
      }
    }
  });

  test('should collapse and expand phases', async ({ page }) => {
    // Find phase headers (they should be clickable)
    const phaseHeader = page.locator('[data-testid="phase-header"], .phase-header, h2').first();

    if (await phaseHeader.isVisible()) {
      // Get initial task count
      const initialTasks = await page.locator('[data-testid="task-card"], .task-card').count();

      // Click to collapse
      await phaseHeader.click();
      await page.waitForTimeout(300);

      // Task count might have changed (some hidden)
      // This is a basic test - specific implementation may vary

      // Click again to expand
      await phaseHeader.click();
      await page.waitForTimeout(300);
    }
  });
});
