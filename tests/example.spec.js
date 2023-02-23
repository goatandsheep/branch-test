// @ts-check
const { test, expect } = require('@playwright/test');
const { scrapeCandidates } = require('../index')

test('run scrape', async() => {
  const races = await scrapeCandidates()
  await expect(races.length).toBeGreaterThan(2)
  await expect(races[0].candidates.length).toBeGreaterThan(0)
})
test('run scrape date', async() => {
  const races = await scrapeCandidates('2023-01-02')
  console.log(JSON.stringify(races))
  await expect(races.length).toBeGreaterThan(0)
  await expect(races[0].candidates.length).toBeGreaterThan(0)
})

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
