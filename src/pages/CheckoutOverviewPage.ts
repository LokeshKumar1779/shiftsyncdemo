import { Page, Locator, expect } from "@playwright/test";

export class CheckoutOverviewPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly pageTitle: Locator;
  readonly summaryItemName: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(".title");
    this.summaryItemName = page.locator(".cart_item .inventory_item_name");
    this.subtotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
    this.finishButton = page.locator("#finish");
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  async finishOrder() {
    await this.finishButton.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-two/);
    await expect(this.pageTitle).toHaveText("Checkout: Overview");
  }

  async verifyOrderSummary(productName: string, productPrice: string) {
    await expect(this.summaryItemName).toHaveText(productName);
    await expect(this.subtotalLabel).toBeVisible();
    await expect(this.taxLabel).toBeVisible();
    await expect(this.totalLabel).toBeVisible();

    const subtotalText = await this.subtotalLabel.innerText();
    expect(subtotalText).toContain(productPrice.replace("$", ""));
  }
}
