/**
 * Tests for "mode" command handling
 */

import { test, expect } from "@playwright/test";
const url = "http://localhost:8000/";

test("default mode is brief", async ({ page }) => {
  await page.goto(url);
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in brief mode" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in verbose mode" })
  ).not.toBeVisible();
});

test("after i click button, command gets pushed for mode brief", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode brief");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText("output mode: brief", { exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Submit \n (currently in brief mode" })
  ).toBeVisible();
});

test("after i click button, command gets pushed for mode verbose", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText("Command: mode verbose \n Output: output mode: verbose", {
      exact: true,
    })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Submit \n (currently in verbose mode" })
  ).toBeVisible();
});

test("after i hit enter, command gets pushed for mode brief", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode brief");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("output mode: brief", { exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Submit \n (currently in brief mode" })
  ).toBeVisible();
});

test("after i hit enter, command gets pushed for mode verbose", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Command: mode verbose \n Output: output mode: verbose", {
      exact: true,
    })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Submit \n (currently in verbose mode" })
  ).toBeVisible();
});

test("switching from brief to verbose then back to brief with button", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText("Command: mode verbose \n Output: output mode: verbose", {
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in verbose mode" })
  ).toBeVisible();

  await page.getByLabel("Command input").fill("mode brief");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();
  await expect(
    page.getByText("output mode: brief", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in brief mode" })
  ).toBeVisible();
});

test("switching from brief to verbose then back to brief with enter key", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Command: mode verbose \n Output: output mode: verbose", {
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in verbose mode" })
  ).toBeVisible();

  await page.getByLabel("Command input").fill("mode brief");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("output mode: brief", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in brief mode" })
  ).toBeVisible();
});

test("switching from brief to verbose then back to brief with button then enter", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText("Command: mode verbose \n Output: output mode: verbose", {
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in verbose mode" })
  ).toBeVisible();

  await page.getByLabel("Command input").fill("mode brief");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("output mode: brief", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in brief mode" })
  ).toBeVisible();
});

test("switching from brief to verbose then back to brief with enter then button", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Command: mode verbose \n Output: output mode: verbose", {
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in verbose mode" })
  ).toBeVisible();

  await page.getByLabel("Command input").fill("mode brief");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();
  await expect(
    page.getByText("output mode: brief", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit \n (currently in brief mode" })
  ).toBeVisible();
});

test("trying to switch to an invalid mode on startup (in brief mode)", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode asdf");
  await page.keyboard.press("Enter");
  await expect(page.getByText("Invalid mode", { exact: true, })).toBeVisible();
});

test("trying to switch to an invalid mode in verbose mode)", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");

  await page.getByLabel("Command input").fill("mode qwer");
  await page.keyboard.press("Enter");
  await expect(page.getByText("Command: mode qwer \n Output: Invalid mode", { exact: true, })).toBeVisible();
});

test("trying to switch to an invalid mode in brief mode after switching)", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");

  await page.getByLabel("Command input").fill("mode brief");
  await page.keyboard.press("Enter");

  await page.getByLabel("Command input").fill("mode cs32isawesome");
  await page.keyboard.press("Enter");
  await expect(page.getByText("Invalid mode", { exact: true, })).toBeVisible();
});
