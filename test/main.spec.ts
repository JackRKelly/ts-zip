import "jest";
import { expect } from "chai";
import { unzip } from "../src/unzip";
import { formatModDate, formatModTime } from "../src/util";
import * as path from "path";

describe("Unzip", () => {
  // TODO: jack pls specify any specifics about the provided zip in name?
  test("Test zip", () => {
    const mockUnzip = jest.fn(() => unzip(path.join(__dirname, "test.zip")));
    mockUnzip();
  });
});

describe("Date & Time", () => {
  test("Format modification time function", () => {
    expect(formatModTime(19368) == "09:29:16");
  });
  test("Format modification date function", () => {
    expect(formatModDate(20875) == "12/11/2020");
  });
});
