/**
 * Tests for "search" command handling
 */

import { test, expect } from "@playwright/test";
const url: string = "http://localhost:8000/";

test("error when running search command before loading a csv", async ({
  page,
}) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("search apples");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText('{"type":"error","error_type":"error_datasource"}', {
      exact: true,
    })
  ).toBeVisible();
});

test("successfully searching the entire CSV", async ({ page }) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("search apples");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText = await page.getByRole("table").innerHTML();
  const actualText =
    "<tr><td>apples</td><td>are</td><td>cool</td><td>0000</td></tr><tr><td>aren't</td><td>apples</td><td>really</td><td>cool!</td></tr>";
  expect(tableText).toBe(actualText);
});

test("error when search command is invalidly formatted", async ({ page }) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("search");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText('{"type":"error","error_type":"error_bad_request"}', {
      exact: true,
    })
  ).toBeVisible();
});

test("error when search command is too long", async ({ page }) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("search state Rhode Island");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText('{"type":"error","error_type":"error_bad_request"}', {
      exact: true,
    })
  ).toBeVisible();
});

test("successful search that returns no results", async ({ page }) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("search oranges");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText("No results found", {
      exact: true,
    })
  ).toBeVisible();
});

test("successful search for a multi-word value", async ({ page }) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill('search "Rhode Island"');
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText = await page.getByRole("table").innerHTML();
  const actualText =
    "<tr><td>Rhode Island</td><td>19999</td><td>20.344</td><td>true</td></tr>";
  expect(tableText).toBe(actualText);
});

test("successful search by column index", async ({ page }) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("search 2 brown");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText = await page.getByRole("table").innerHTML();
  const actualText =
    "<tr><td>the</td><td>quick</td><td>brown</td><td>fox</td><td>jumped</td></tr>";
  expect(tableText).toBe(actualText);
});

test("successful search by column name", async ({ page }) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("search fruit apples");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText = await page.getByRole("table").innerHTML();
  const actualText =
    "<tr><td>apples</td><td>are</td><td>cool</td><td>0000</td></tr><tr><td>aren't</td><td>apples</td><td>really</td><td>cool!</td></tr>";
  expect(tableText).toBe(actualText);
});

test("successful search by multi-word column name", async ({ page }) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page
    .getByLabel("Command input")
    .fill('search "Median Household Income" "Rhode Island"');
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText = await page.getByRole("table").innerHTML();
  const actualText =
    "<tr><td>Rhode Island</td><td>19999</td><td>20.344</td><td>true</td></tr>";
  expect(tableText).toBe(actualText);
});
