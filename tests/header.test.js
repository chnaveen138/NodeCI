const puppeteer = require("puppeteer");
const Page = require("./helpers/page");
const CustomPage = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("Checking Logo Text", async () => {
  const logoText = await page.getContentsOf("a.brand-logo");
  expect(logoText).toEqual("Blogster");
});

test("Clicking on login button", async () => {
  await page.click(".right a");
  const url = page.url();
  expect(url).toMatch(new RegExp("accounts.google.com"));
});

test("Shows logout button after login", async () => {
  await page.login();
  const logoutText = await page.getContentsOf("a[href='/auth/logout']");
  expect(logoutText).toEqual("Logout");
});
