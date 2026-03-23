import { Page, Locator, expect } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(".title");
    this.inventoryItems = page.locator(".inventory_item");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
  }

  // ── Item-scoped locators ──────────────────────────────────────────────────
  getItemName(item: Locator): Locator {
    return item.locator(".inventory_item_name");
  }

  getItemPrice(item: Locator): Locator {
    return item.locator(".inventory_item_price");
  }

  getAddToCartButton(item: Locator): Locator {
    return item.locator('button[id^="add-to-cart"]');
  }

  getRemoveButton(item: Locator): Locator {
    return item.locator('button[id^="remove"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  async getFirstProductName(): Promise<string> {
    return this.getItemName(this.inventoryItems.first()).innerText();
  }

  async getFirstProductPrice(): Promise<string> {
    return this.getItemPrice(this.inventoryItems.first()).innerText();
  }

  getProductByName(productName: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.locator(".inventory_item_name", { hasText: productName }),
    });
  }

  async getProductPriceByName(productName: string): Promise<string> {
    return this.getItemPrice(this.getProductByName(productName)).innerText();
  }

  async addFirstProductToCart() {
    const firstItem = this.inventoryItems.first();
    await this.getAddToCartButton(firstItem).click();
  }

  async addProductToCartByName(productName: string) {
    await this.getAddToCartButton(this.getProductByName(productName)).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.pageTitle).toHaveText("Products");
  }

  async verifyCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async verifyFirstItemAddedToCart() {
    const firstItem = this.inventoryItems.first();
    await expect(this.getRemoveButton(firstItem)).toBeVisible();
  }

  async verifyProductAddedToCartByName(productName: string) {
    await expect(
      this.getRemoveButton(this.getProductByName(productName)),
    ).toBeVisible();
  }
}
