import { expect, test } from "@playwright/test";

test.describe("public marketing pages", () => {
  test("homepage loads with TradeBib branding", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/TradeBib/i);
    await expect(page.getByRole("banner").getByText(/TradeBib/i).first()).toBeVisible();
  });

  test("marketplace lists bots and opens a detail page", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(
      page.getByRole("heading", { name: /browse.*verified mt5 bots/i })
    ).toBeVisible({ timeout: 15_000 });

    const details = page.getByRole("link", { name: /view details/i }).first();
    await expect(details).toBeVisible();
    await details.click();
    await expect(page).toHaveURL(/\/bots\//);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("pricing page renders plan content", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText(/pricing|plan|starter|pro|elite/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("blog index and post are reachable", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /blog/i }).first()).toBeVisible({
      timeout: 15_000,
    });

    const postLink = page.locator('a[href^="/blog/"]').first();
    await expect(postLink).toBeVisible();
    await postLink.click();
    await expect(page).toHaveURL(/\/blog\//);
    await expect(page.locator("article, main").first()).toBeVisible();
  });

  test("compare page loads with metrics and charts", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.getByRole("heading", { name: /bot comparison/i })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(/best roi|performance|pricing/i).first()).toBeVisible();
    await expect(page.getByRole("tab", { name: /equity|roi|drawdown/i }).first()).toBeVisible();
  });

  test("MT5 code lab shares educational samples", async ({ page }) => {
    await page.goto("/learn");
    await expect(page.getByRole("heading", { name: /mt5 code/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("button", { name: /copy code/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /download \.mq5/i })).toBeVisible();
    await expect(page.getByText(/educational use only/i)).toBeVisible();
  });

  test("robots.txt and sitemap are served", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toMatch(/Sitemap/i);

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toMatch(/urlset|url/i);
  });

  test("health endpoint responds", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBeLessThan(500);
    const body = await res.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("checks");
    expect(body.service).toBe("tradebib");
  });
});

test.describe("auth entry points", () => {
  test("login page shows sign-in form fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
  });
});
