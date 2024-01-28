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

test("Should show hotel search result",async({page})=>{
    await page.goto(UI_URL)
    await page.getByPlaceholder("Where are you going").fill("amravati");
    await page.getByRole("button",{name:"Search"}).click();
    await expect(page.getByText("Hotels foundin amravati")).toBeVisible();
    await expect(page.getByText("Aniket Gedam")).toBeVisible();
})