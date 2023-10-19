/**
 * Tests for "load" command handling
 */

import { test, expect } from "@playwright/test";
const url = "http://localhost:8000/";

test("successfully loading a csv in brief mode", async ({ page }) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("load_file test.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText('{"type":"success","details":"file loaded successfully"}', {
      exact: true,
    })
  ).toBeVisible();
});

test("successfully loading a csv in verbose mode", async ({ page }) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(
      'Command: load_file words.csv \n Output: {"type":"success","details":"file loaded successfully"}',
      { exact: true }
    )
  ).toBeVisible();
});

test("sucessfully loading a csv then another csv in brief mode (will check viewing later)", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText('{"type":"success","details":"file loaded successfully"}', {
      exact: true,
    })
  ).toBeVisible();

  await page.getByLabel("Command input").fill("load_file test.csv");
  await page.keyboard.press("Enter");
  await expect(
    page
      .getByText('{"type":"success","details":"file loaded successfully"}', {
        exact: true,
      })
      .nth(1)
  ).toBeVisible();
});

test("sucessfully loading a csv then another csv in verbose mode (will check viewing later)", async ({
  page,
}) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await page.getByLabel("Command input").fill("load_file test.csv");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(
      'Command: load_file test.csv \n Output: {"type":"success","details":"file loaded successfully"}',
      { exact: true }
    )
  ).toBeVisible();

  await page.getByLabel("Command input").fill("load_file words.csv");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(
      'Command: load_file words.csv \n Output: {"type":"success","details":"file loaded successfully"}',
      { exact: true }
    )
  ).toBeVisible();
});

test("failure loading a csv in brief mode", async ({ page }) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("load_file abcdefg");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText('{"type":"error","error_type":"error_datasource"}', {
      exact: true,
    })
  ).toBeVisible();
});

test("failure loading a csv in verbose mode", async ({ page }) => {
  await page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");
  await page.getByLabel("Command input").fill("load_file asdfasdfasdf");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(
      'Command: load_file asdfasdfasdf \n Output: {"type":"error","error_type":"error_datasource"}',
      { exact: true }
    )
  ).toBeVisible();
});
