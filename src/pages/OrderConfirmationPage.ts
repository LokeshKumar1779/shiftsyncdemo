import { Page, Locator, expect } from "@playwright/test";

export class OrderConfirmationPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly pageTitle: Locator;
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly ponyExpressImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(".title");
    this.confirmationHeader = page.locator(".complete-header");
    this.confirmationText = page.locator(".complete-text");
    this.ponyExpressImage = page.locator(".pony_express");
    this.backHomeButton = page.locator("#back-to-products");
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  async backToHome() {
    await this.backHomeButton.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/checkout-complete/);
    await expect(this.pageTitle).toHaveText("Checkout: Complete!");
  }

  async verifyOrderConfirmed() {
    await expect(this.confirmationHeader).toHaveText(
      "Thank you for your order!",
    );
    await expect(this.confirmationText).toContainText(
      "Your order has been dispatched",
    );
    await expect(this.ponyExpressImage).toBeVisible();
  }
}
