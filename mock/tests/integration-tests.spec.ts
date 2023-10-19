/**
 * Integration testing class
 */

import { test, expect } from "@playwright/test";
const url = "http://localhost:8000/";

/**
 * Load-view tests
 */

test("successfully loading a csv and viewing it in brief mode", async ({
  page,
}) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file test.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText = await page.getByRole("table").innerHTML();
  const actualText =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>a</td><td>b</td><td>c</td><td>d</td><td>e</td></tr>";
  expect(tableText).toBe(actualText);
});

test("successfully loading a csv and viewing it in verbose mode", async ({
  page,
}) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();

  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText = await page.getByRole("table").innerHTML();
  const actualText =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>the</td><td>quick</td><td>brown</td><td>fox</td><td>jumped</td></tr>";
  expect(tableText).toBe(actualText);
});

test("failure viewing a csv if no csv is loaded in brief mode", async ({
  page,
}) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("view");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText('{"type":"error","error_type":"error_no_file_loaded"}', {
      exact: true,
    })
  ).toBeVisible();
});

test("failure viewing a csv if no csv is loaded in verbose mode", async ({
  page,
}) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");
  await page.getByLabel("Command input").fill("view");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(
      'Command: view \n Output: {"type":"error","error_type":"error_no_file_loaded"}',
      { exact: true }
    )
  ).toBeVisible();
});

test("successfully loading a csv then viewing it then loading a different csv then viewing it in brief mode", async ({
  page,
}) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file test.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText1 = await page.getByRole("table").innerHTML();
  const actualText1 =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>a</td><td>b</td><td>c</td><td>d</td><td>e</td></tr>";
  expect(tableText1).toBe(actualText1);

  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table").nth(1)).toBeVisible();
  const tableText2 = await page.getByRole("table").nth(1).innerHTML();
  const actualText2 =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>the</td><td>quick</td><td>brown</td><td>fox</td><td>jumped</td></tr>";
  expect(tableText2).toBe(actualText2);
});

test("successfully loading a csv then viewing it then loading a different csv then viewing it in verbose mode", async ({
  page,
}) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();

  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText1 = await page.getByRole("table").innerHTML();
  const actualText1 =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>the</td><td>quick</td><td>brown</td><td>fox</td><td>jumped</td></tr>";
  expect(tableText1).toBe(actualText1);

  await page.getByLabel("Command input").fill("load_file test.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();

  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();
  await expect(page.getByRole("table").nth(1)).toBeVisible();
  const tableText2 = await page.getByRole("table").nth(1).innerHTML();
  const actualText2 =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>a</td><td>b</td><td>c</td><td>d</td><td>e</td></tr>";
  expect(tableText2).toBe(actualText2);
});

test("successfully loading a csv then viewing it then loading a different csv then viewing it starting in verbose mode then brief mode after", async ({
  page,
}) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();

  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText1 = await page.getByRole("table").innerHTML();
  const actualText1 =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>the</td><td>quick</td><td>brown</td><td>fox</td><td>jumped</td></tr>";
  expect(tableText1).toBe(actualText1);

  await page.getByLabel("Command input").fill("mode brief");
  await page.keyboard.press("Enter");
  await page.getByLabel("Command input").fill("load_file test.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table").nth(1)).toBeVisible();
  const tableText2 = await page.getByRole("table").nth(1).innerHTML();
  const actualText2 =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>a</td><td>b</td><td>c</td><td>d</td><td>e</td></tr>";
  expect(tableText2).toBe(actualText2);
});

test("successfully loading a csv then viewing it then loading a different csv then viewing it starting in brief mode then verbose mode after", async ({
  page,
}) => {
  page.goto(url);
  await page.getByLabel("Command input").fill("load_file test.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();

  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText1 = await page.getByRole("table").innerHTML();
  const actualText1 =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>a</td><td>b</td><td>c</td><td>d</td><td>e</td></tr>";
  expect(tableText1).toBe(actualText1);

  await page.getByLabel("Command input").fill("mode verbose");
  await page.keyboard.press("Enter");
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();

  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();
  await expect(page.getByRole("table").nth(1)).toBeVisible();
  const tableText2 = await page.getByRole("table").nth(1).innerHTML();
  const actualText2 =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>the</td><td>quick</td><td>brown</td><td>fox</td><td>jumped</td></tr>";
  expect(tableText2).toBe(actualText2);
});

/**
 * Search integration tests
 */

test("switch to verbose, search for a value", async ({ page }) => {
  page.goto(url);
  // load file
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  // switch to verbose mode
  await page.getByLabel("Command input").fill("mode verbose");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Submit \n (currently in verbose mode)",
    })
  ).toBeVisible();
  await expect(
    page.getByText("Command: mode verbose \n Output: output mode: verbose", {
      exact: true,
    })
  ).toBeVisible();
  // search for "apples"
  await page.getByLabel("Command input").fill("search apples");
  await page
    .getByRole("button", { name: "Submit \n (currently in verbose mode)" })
    .click();
  await expect(
    page.getByText("Command: search apples \n Output: ", {
      exact: false,
    })
  ).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText = await page.getByRole("table").innerHTML();
  const actualText =
    "<tr><td>apples</td><td>are</td><td>cool</td><td>0000</td></tr><tr><td>aren't</td><td>apples</td><td>really</td><td>cool!</td></tr>";
  expect(tableText).toBe(actualText);
});

test("search in two different csv files", async ({ page }) => {
  page.goto(url);
  // load file
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText('{"type":"success","details":"file loaded successfully"}', {
      exact: true,
    })
  ).toBeVisible();

  // search for "apples"
  await page.getByLabel("Command input").fill("search apples");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText1 = await page.getByRole("table").innerHTML();
  const actualText1 =
    "<tr><td>apples</td><td>are</td><td>cool</td><td>0000</td></tr><tr><td>aren't</td><td>apples</td><td>really</td><td>cool!</td></tr>";
  expect(tableText1).toBe(actualText1);

  // load another file
  await page.getByLabel("Command input").fill("load_file test.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page
      .getByText('{"type":"success","details":"file loaded successfully"}', {
        exact: true,
      })
      .nth(1)
  ).toBeVisible();

  // search for "oranges"
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

test("load, view, search", async ({ page }) => {
  page.goto(url);
  // load file
  await page.getByLabel("Command input").fill("load_file words.csv");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(
    page.getByText('{"type":"success","details":"file loaded successfully"}', {
      exact: true,
    })
  ).toBeVisible();

  // view file
  await page.getByLabel("Command input").fill("view");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table")).toBeVisible();
  const tableText1 = await page.getByRole("table").innerHTML();
  const actualText1 =
    "<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>the</td><td>quick</td><td>brown</td><td>fox</td><td>jumped</td></tr>";
  expect(tableText1).toBe(actualText1);

  // search for "brown"
  await page.getByLabel("Command input").fill("search 2 brown");
  await page
    .getByRole("button", { name: "Submit \n (currently in brief mode)" })
    .click();
  await expect(page.getByRole("table").nth(1)).toBeVisible();
  const tableText2 = await page.getByRole("table").nth(1).innerHTML();
  const actualText2 =
    "<tr><td>the</td><td>quick</td><td>brown</td><td>fox</td><td>jumped</td></tr>";
  expect(tableText2).toBe(actualText2);
});
