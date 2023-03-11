import { createUrl } from "../src";

test("change path", () => {
  const url = new URL("https://example.com");

  expect(createUrl(url, {}).toString()).toBe(url.toString());
});
