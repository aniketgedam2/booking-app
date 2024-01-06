import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  //get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("Sign In successfull!")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("test Hotel");
  await page.locator('[name="city"]').fill("test City");
  await page.locator('[name="country"]').fill("test country");
  await page
    .locator('[name="description"]')
    .fill("This is the description for the test Hotel");
    await page.locator('[name="pricePerNight"]').fill("100");
    await page.selectOption('select[name="starRating"]',"3");

    await page.getByText("Budget").click();

    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();

    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("2");

    await page.setInputFiles('[name="imageFiles"]',[
        path.join(__dirname,"files","1.jpg"),
    ]);

    await page.getByRole('button',{name:"Save"}).click();
    await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

test("should display hotel",async({page})=>{
  await page.goto(`${UI_URL}my-hotels`);
  // await expect(page.getByText("Royel")).toBeVisible();
  await expect(page.getByText("this is the test royel hotel")).toBeVisible();
  await expect(page.getByText("Amravati,India")).toBeVisible();
  await expect(page.getByText("Budget")).toBeVisible();
  await expect(page.getByText("₹1220 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 2 children")).toBeVisible();
  await expect(page.getByText("4 star rating")).toBeVisible();

  await expect(page.getByRole("link",{name:"View Details"})).toBeVisible();
  await expect(page.getByRole("link",{name:"Add Hotel"})).toBeVisible();
})