import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes } from '../src/render.js';
for (const route of routes) {
  test(`${route.path}: content, links and accessibility`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(route.path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
for (const width of [360, 390, 768, 1024, 1440, 1920]) {
  test(`responsive screenshot at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
  });
}
test('mobile menu keyboard path', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('navigation').getByRole('link', { name: 'Services', exact: true }).click();
  await expect(page).toHaveURL(/\/services\/$/);
  await menu.click();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
});
test('contact brief preserves input and copies accurate text', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/contact/');
  await page.getByLabel('Your name').fill('Synthetic Test');
  await page.getByLabel('Phone number').fill('0000000000');
  await page.getByLabel('Email address').fill('test@example.com');
  await page.getByLabel('Project suburb').fill('Test location');
  await page.getByLabel('Type of work').selectOption('painting');
  await page
    .getByLabel('Tell us about the project')
    .fill('Synthetic enquiry used for browser testing only.');
  await page.getByRole('button', { name: 'Copy project brief' }).click();
  await expect(page.getByRole('status')).toContainText('Project brief copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Synthetic enquiry');
  await expect(page.getByLabel('Your name')).toHaveValue('Synthetic Test');
  await expect(page.getByRole('button', { name: 'Request a project quote' })).toBeHidden();
});
test('privacy choices and direct thank-you do not fake acceptance', async ({ page }) => {
  await page.goto('/thank-you/');
  await expect(page.locator('main')).toContainText('does not');
  await page.getByRole('button', { name: 'Privacy choices' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close privacy choices' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
