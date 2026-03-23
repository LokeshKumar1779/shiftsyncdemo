import { expect } from "@playwright/test";
import { test } from "./fixtures";
import productsData from "../src/test-data/products.json";

const CREDENTIALS = {
  username: "standard_user",
  password: "secret_sauce",
};
const LOCKED_OUT_CREDENTIALS = {
  username: "locked_out_user",
  password: "secret_sauce",
};

const CUSTOMER = {
  firstName: "John",
  lastName: "Doe",
  postalCode: "10001",
};
const DATA_DRIVEN_PRODUCTS = productsData.products;

test.describe("SauceDemo – Purchase Flow", () => {
  test("should login, add first product to cart, checkout and confirm order", async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    confirmationPage,
  }) => {
    // ── 1. Navigate & Login ───────────────────────────────────────────────
    await test.step("Navigate to SauceDemo and login", async () => {
      await loginPage.navigate();
      await loginPage.verifyPageLoaded();
      await loginPage.login(CREDENTIALS.username, CREDENTIALS.password);
      await inventoryPage.verifyPageLoaded();
    });

    // ── 2. Capture First Product Details ──────────────────────────────────
    let firstProductName = "";
    let firstProductPrice = "";

    await test.step("Capture details of the first product", async () => {
      firstProductName = await inventoryPage.getFirstProductName();
      firstProductPrice = await inventoryPage.getFirstProductPrice();
      console.log(
        `First product: "${firstProductName}" @ ${firstProductPrice}`,
      );
    });

    // ── 3. Add First Product to Cart ──────────────────────────────────────
    await test.step("Add the first product to the cart", async () => {
      await inventoryPage.addFirstProductToCart();
      await inventoryPage.verifyFirstItemAddedToCart();
      await inventoryPage.verifyCartBadgeCount(1);
    });

    // ── 4. Open Cart & Verify ─────────────────────────────────────────────
    await test.step("Open the cart and verify product is present", async () => {
      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();
      await cartPage.verifyCartContains(firstProductName, firstProductPrice);
    });

    // ── 5. Checkout – Customer Information ────────────────────────────────
    await test.step("Proceed to checkout and fill in personal information", async () => {
      await cartPage.proceedToCheckout();
      await checkoutInfoPage.verifyPageLoaded();
      await checkoutInfoPage.fillCustomerInfo(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );
      await checkoutInfoPage.continue();
    });

    // ── 6. Checkout – Order Summary ───────────────────────────────────────
    await test.step("Verify order summary before placing order", async () => {
      await checkoutOverviewPage.verifyPageLoaded();
      await checkoutOverviewPage.verifyOrderSummary(
        firstProductName,
        firstProductPrice,
      );
    });

    // ── 7. Place Order ────────────────────────────────────────────────────
    await test.step("Finish the order", async () => {
      await checkoutOverviewPage.finishOrder();
    });

    // ── 8. Confirm Order Placed Successfully ──────────────────────────────
    await test.step("Confirm order placement success message", async () => {
      await confirmationPage.verifyPageLoaded();
      await confirmationPage.verifyOrderConfirmed();
      console.log("✅  Order placed successfully!");
    });

    // ── 9. Return Home ────────────────────────────────────────────────────
    await test.step("Return to the products page via Back Home button", async () => {
      await confirmationPage.backToHome();
      await inventoryPage.verifyPageLoaded();
    });
  });
});

test.describe("SauceDemo – Authentication Error Scenarios", () => {
  test("should show an error for locked-out user", async ({ page, loginPage }) => {
    const errorMessage = page.locator('[data-test="error"]');

    await loginPage.navigate();
    await loginPage.verifyPageLoaded();
    await loginPage.login(
      LOCKED_OUT_CREDENTIALS.username,
      LOCKED_OUT_CREDENTIALS.password,
    );

    await expect(errorMessage).toContainText(
      "Sorry, this user has been locked out.",
    );
    await expect(page).not.toHaveURL(/inventory/);
  });

  test("should show an error for invalid password", async ({ page, loginPage }) => {
    const errorMessage = page.locator('[data-test="error"]');

    await loginPage.navigate();
    await loginPage.verifyPageLoaded();
    await loginPage.login(CREDENTIALS.username, "invalid_password");

    await expect(errorMessage).toContainText(
      "Username and password do not match any user in this service",
    );
    await expect(page).not.toHaveURL(/inventory/);
  });

  test("should require username when credentials are empty", async ({
    page,
    loginPage,
  }) => {
    const errorMessage = page.locator('[data-test="error"]');

    await loginPage.navigate();
    await loginPage.verifyPageLoaded();
    await loginPage.login("", "");

    await expect(errorMessage).toContainText("Username is required");
    await expect(page).not.toHaveURL(/inventory/);
  });
});

test.describe("SauceDemo – Data Driven Product Scenarios", () => {
  for (const productName of DATA_DRIVEN_PRODUCTS) {
    test(`should add "${productName}" to cart and validate details`, async ({
      loginPage,
      inventoryPage,
      cartPage,
    }) => {
      await loginPage.navigate();
      await loginPage.verifyPageLoaded();
      await loginPage.login(CREDENTIALS.username, CREDENTIALS.password);
      await inventoryPage.verifyPageLoaded();

      const productPrice = await inventoryPage.getProductPriceByName(productName);
      await inventoryPage.addProductToCartByName(productName);
      await inventoryPage.verifyProductAddedToCartByName(productName);
      await inventoryPage.verifyCartBadgeCount(1);

      await inventoryPage.goToCart();
      await cartPage.verifyPageLoaded();
      await cartPage.verifyCartContainsProduct(productName, productPrice);
    });
  }
});
