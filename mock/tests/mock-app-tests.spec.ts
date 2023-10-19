/**
 * Tests to check that the page has generally rendered correctly
 */

import { test, expect } from "@playwright/test";
const url = "http://localhost:8000/";

test("button loads", async ({ page }) => {
  // render(<REPLInput />);
  await page.goto(url);
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in brief mode)" })
  ).toBeVisible();
});

test("on page load, i see an input bar", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto(url);
  await expect(page.getByLabel("Command input")).toBeVisible();
});

test("entering invalid commands with button in brief mode", async ({
  page,
}) => {
  // Enter 'hi' as a command
  await page.goto(url);
  await page.getByLabel("Command input").fill("hi");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText("Invalid command", { exact: true })
  ).toBeVisible();

  // Click button without entering anything
  await expect(page.getByLabel("Command input")).toHaveText("");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText("Invalid command", { exact: true }).nth(1)
  ).toBeVisible();
});

test("entering invalid commands with enter key in brief mode", async ({
  page,
}) => {
  // Enter 'hi' as a command
  await page.goto(url);
  await page.getByLabel("Command input").fill("hello");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Invalid command", { exact: true })
  ).toBeVisible();

  // Hit enter key without entering anything
  await expect(page.getByLabel("Command input")).toHaveText("");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Invalid command", { exact: true }).nth(1)
  ).toBeVisible();
});

test("entering invalid commands with button in verbose mode", async ({
  page,
}) => {
  // Enter 'hi' as a command
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("hi");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();
  await expect(
    page.getByText('Command: hi \n Output: Invalid command: "hi"', {
      exact: true,
    })
  ).toBeVisible();

  // Click button without entering anything
  await expect(page.getByLabel("Command input")).toHaveText("");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();
  await expect(
    page.getByText('Command: \n Output: Invalid command: ""', { exact: true })
  ).toBeVisible();
});

test("entering invalid commands with enter key in verbose mode", async ({
  page,
}) => {
  // Enter 'hi' as a command
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");

  await page.getByLabel("Command input").fill("hi");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText('Command: hi \n Output: Invalid command: "hi"', {
      exact: true,
    })
  ).toBeVisible();

  // Hit enter key without entering anything
  await expect(page.getByLabel("Command input")).toHaveText("");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText('Command: \n Output: Invalid command: ""', { exact: true })
  ).toBeVisible();
});
