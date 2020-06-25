const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});
afterEach(async () => {
  await page.close();
});

describe("When logged in, ", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });
  test("Able to see create new new blog form", async () => {
    const labelText = await page.getContentsOf(".title > label:nth-child(1)");
    expect(labelText).toEqual("Blog Title");
  });
  describe("And when submitting invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });
    test("Should see the error messages", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");

      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

describe("When user is not logged in", async () => {
  test("Should not be able to create posts", async () => {
    const result = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title: "New Blog Post Title",
          content: "New Blog Post Content"
        })
      }).then(res => res.json());
    });
    expect(result).toEqual({ error: 'You must log in!' });
  });
});
