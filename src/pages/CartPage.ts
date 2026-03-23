import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly pageTitle: Locator;
  readonly cartItemName: Locator;
  readonly cartItemPrice: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(".title");
    this.cartItemName = page.locator(".cart_item .inventory_item_name");
    this.cartItemPrice = page.locator(".cart_item .inventory_item_price");
    this.checkoutButton = page.locator("#checkout");
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.pageTitle).toHaveText("Your Cart");
  }

  async verifyCartContains(productName: string, productPrice: string) {
    await expect(this.cartItemName).toHaveText(productName);
    await expect(this.cartItemPrice).toHaveText(productPrice);
  }

  async verifyCartContainsProduct(productName: string, productPrice: string) {
    const cartItem = this.page
      .locator(".cart_item")
      .filter({
        has: this.page.locator(".inventory_item_name", { hasText: productName }),
      })
      .first();

    await expect(cartItem.locator(".inventory_item_name")).toHaveText(productName);
    await expect(cartItem.locator(".inventory_item_price")).toHaveText(productPrice);
  }
}
