import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#user-name");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#login-button");
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  async navigate() {
    await this.page.goto("/");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async verifyPageLoaded() {
    await expect(this.page).toHaveTitle(/Swag Labs/);
    await expect(this.loginButton).toBeVisible();
  }
}
