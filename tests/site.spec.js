import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes } from '../src/render.js';

async function loadPhotographs(page) {
  return page.locator('img').evaluateAll(async (images) => {
    images.forEach((image) => {
      image.loading = 'eager';
    });
    return Promise.all(
      images.map(async (image) => {
        try {
          await image.decode();
        } catch {
          return image.currentSrc || image.src;
        }
        return image.naturalWidth > 0 ? null : image.currentSrc || image.src;
      }),
    ).then((results) => results.filter(Boolean));
  });
}

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
    expect(await loadPhotographs(page)).toEqual([]);
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

test('optional analytics is denied by default, rejects personal fields, and supports withdrawal', async ({
  page,
}) => {
  await page.route('https://www.googletagmanager.com/**', (route) =>
    route.fulfill({ body: '', contentType: 'application/javascript' }),
  );
  await page.goto('/');
  await page.evaluate(async () => {
    const { initialiseTracking } = await import('/src/tracking.js');
    window.syntheticTracking = initialiseTracking({
      approved: true,
      mode: 'production',
      gtmId: 'GTM-SYNTHETIC',
    });
  });
  await expect(page.getByRole('region', { name: 'Optional analytics choices' })).toBeVisible();
  await page.evaluate(() =>
    window.syntheticTracking.track('generate_lead', {
      email: 'synthetic@example.com',
      brief: 'private synthetic message',
    }),
  );
  expect(await page.evaluate(() => window.dataLayer.some((e) => e.event === 'generate_lead'))).toBe(
    false,
  );
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).first().click();
  await page.evaluate(() =>
    window.syntheticTracking.track('generate_lead', {
      email: 'synthetic@example.com',
      brief: 'private synthetic message',
      service: 'painting',
    }),
  );
  expect(
    await page.evaluate(() => window.dataLayer.filter((e) => e.event === 'generate_lead')),
  ).toEqual([{ event: 'generate_lead', service: 'painting' }]);
  await page.getByRole('button', { name: 'Privacy choices' }).click();
  await page.getByRole('button', { name: 'Withdraw analytics permission' }).click();
  await page.evaluate(() => window.syntheticTracking.track('click_call'));
  expect(await page.evaluate(() => window.dataLayer.some((e) => e.event === 'click_call'))).toBe(
    false,
  );
  await page.reload();
  await page.evaluate(async () => {
    const { initialiseTracking } = await import('/src/tracking.js');
    window.syntheticTracking = initialiseTracking({
      approved: true,
      mode: 'production',
      gtmId: 'GTM-SYNTHETIC',
    });
  });
  expect(await page.evaluate(() => window.syntheticTracking.accepted)).toBe(false);
  await expect(page.getByRole('region', { name: 'Optional analytics choices' })).toBeHidden();
});

test('all routes remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto('http://127.0.0.1:5173' + route.path);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.locator('main').innerText()).not.toBe('');
  }
  await page.goto('http://127.0.0.1:5173/contact/');
  await expect(page.locator('main a[href^="mailto:"]').first()).toBeVisible();
  await context.close();
});

test('source photographs load throughout the portfolio and service pages', async ({ page }) => {
  const photoRoutes = routes.filter(
    (route) =>
      route.path === '/' ||
      route.path === '/about/' ||
      route.path.startsWith('/services/') ||
      route.path.startsWith('/projects/'),
  );
  for (const route of photoRoutes) {
    await page.goto(route.path);
    expect(await page.locator('main picture img').count()).toBeGreaterThan(0);
    expect(await loadPhotographs(page), route.path).toEqual([]);
    await expect(page.locator('main svg.drawing')).toHaveCount(0);
  }
  await page.goto('/projects/');
  await expect(page.locator('main picture img')).toHaveCount(16);
});
