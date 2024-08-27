import { test, expect } from "vitest";
import { format } from "./formatter";

test("format", () => {
  const actual = format(`select "hello, world!"::text as message`);
  const expected = `SELECT "hello, world!"::TEXT AS "message"`;
  expect(actual).toBe(expected);
});
