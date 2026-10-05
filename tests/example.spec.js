// @ts-check
import { test as base, expect } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'https://este-dls.com';

// The home page first asks which version to show. The terminal tests below play a
// returning visitor who already picked the terminal; the chooser has its own tests.
const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => localStorage.setItem('estbn_version', 'terminal'));
    await use(page);
  },
});

// ─── Boot screen ───────────────────────────────────────────────────────────

test('page has correct title', async ({ page }) => {
  await page.goto(BASE);
  await expect(page).toHaveTitle(/ESTBN/);
});

test('boot screen is displayed on first load', async ({ page }) => {
  await page.goto(BASE);
  // Boot sequence text should be visible before entering the terminal
  await expect(page.locator('.boot')).toBeVisible();
});

test('boot sequence shows terminal branding', async ({ page }) => {
  await page.goto(BASE);
  // Wait for the boot title to appear
  await expect(page.locator('.boot-title')).toBeVisible({ timeout: 10000 });
});

test('clicking enter boots into the terminal', async ({ page }) => {
  await page.goto(BASE);
  // Wait for the <GO> prompt to appear, then click it
  await expect(page.locator('.boot-go')).toBeVisible({ timeout: 15000 });
  await page.locator('.boot-go').click();
  await expect(page.locator('.terminal')).toBeVisible();
});

// ─── Terminal navigation ────────────────────────────────────────────────────

test('all 4 tabs are visible after boot', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('.boot-go').waitFor({ timeout: 15000 });
  await page.locator('.boot-go').click();

  for (const label of ['WHO', 'PROJECTS', 'STACK', 'CONTACT']) {
    await expect(page.locator(`.tab:has-text("${label}")`)).toBeVisible();
  }
});

test('clicking a tab switches the section title', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('.boot-go').waitFor({ timeout: 15000 });
  await page.locator('.boot-go').click();

  await page.locator('.tab:has-text("PROJECTS")').click();
  await expect(page.locator('.band-title')).toContainText('PROJECTS');
});

test('keyboard shortcut 2 switches to PROJECTS tab', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('.boot-go').waitFor({ timeout: 15000 });
  await page.locator('.boot-go').click();

  await page.keyboard.press('2');
  await expect(page.locator('.tab-active')).toContainText('PROJECTS');
});

test('arrow keys cycle through tabs', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('.boot-go').waitFor({ timeout: 15000 });
  await page.locator('.boot-go').click();

  // Start on WHO (default), press right to go to PROJECTS
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.tab-active')).toContainText('PROJECTS');
});

// ─── Tweaks panel ──────────────────────────────────────────────────────────

test('pressing T opens the tweaks panel', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('.boot-go').waitFor({ timeout: 15000 });
  await page.locator('.boot-go').click();

  await page.keyboard.press('T');
  await expect(page.locator('[class*="tweaks"], [class*="tw-"]').first()).toBeVisible();
});

// ─── Content checks ────────────────────────────────────────────────────────

test('WHO section displays name and location', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('.boot-go').waitFor({ timeout: 15000 });
  await page.locator('.boot-go').click();

  // WHO is the default tab
  await expect(page.locator('.screen')).toContainText('Esteban', { timeout: 10000 });
  await expect(page.locator('.screen')).toContainText('France');
});

test('CONTACT section displays github and email', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('.boot-go').waitFor({ timeout: 15000 });
  await page.locator('.boot-go').click();

  await page.locator('.tab:has-text("CONTACT")').click();
  await expect(page.locator('.screen')).toContainText('github.com/esteban3114', { timeout: 10000 });
  await expect(page.locator('.screen')).toContainText('este3112008@gmail.com');
});

// ─── Responsive / mobile ───────────────────────────────────────────────────

test('terminal renders on mobile viewport without horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE);
  await page.locator('.boot-go').waitFor({ timeout: 15000 });
  await page.locator('.boot-go').click();

  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const clientWidth = await page.evaluate(() => document.body.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px tolerance
});

// ─── Version chooser and poster ────────────────────────────────────────────

base.describe('version chooser', () => {
  base('first visit shows the chooser, not the terminal', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('.chooser')).toBeVisible();
    await expect(page.locator('.boot')).toHaveCount(0);
  });

  base('picking Terminal starts the boot sequence and is remembered', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('[data-choose="terminal"]').click();
    await expect(page.locator('.boot')).toBeVisible();
    await page.reload();
    await expect(page.locator('.chooser')).toBeHidden();
    await expect(page.locator('.boot, .terminal').first()).toBeVisible();
  });

  base('picking Poster opens the poster, and the home page goes there next time', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('[data-choose="poster"]').click();
    await expect(page).toHaveURL(/\/poster\/$/);
    await expect(page.locator('h1')).toHaveText('Esteban');
    await page.goto(BASE);
    await expect(page).toHaveURL(/\/poster\/$/);
  });

  base('the poster links back to the terminal', async ({ page }) => {
    await page.goto(BASE + '/poster/');
    await page.locator('header .switch').click();
    await expect(page.locator('.boot')).toBeVisible();
  });

  base('the poster lists the four projects and fits a phone screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '/poster/');
    for (const name of ['Rayon', 'Drill', 'Student OS', 'Vadtrade bot']) {
      await expect(page.locator('.proj-name', { hasText: name })).toBeVisible();
    }
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(390);
  });
});

test('V key opens the poster version', async ({ page }) => {
  await page.goto(BASE);
  await page.locator('.boot-go').waitFor({ timeout: 15000 });
  await page.locator('.boot-go').click();
  await page.keyboard.press('v');
  await expect(page).toHaveURL(/\/poster\/$/);
});
