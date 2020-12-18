import "jest";
import { expect } from "chai";
import { unzip } from "../src/unzip";
import { formatModDate, formatModTime, padNumber } from "../src/util";
import * as path from "path";

describe("Unzip", () => {
  // TODO: jack pls specify any specifics about the provided zip in name?
  test("Test zip", () => {
    const mockUnzip = jest.fn(() => unzip(path.join(__dirname, "test.zip")));
    mockUnzip();
  });
});

describe("Utilities", () => {
  test("Format modification time function", () => {
    expect(formatModTime(19368) == "09:29:16");
  });
  test("Format modification date function", () => {
    expect(formatModDate(20875) == "12/11/2020");
  });
  test("Pad number to length of 0", () => {
    expect(padNumber(1, 0) == "1");
  });
  test("Pad number to length of 2", () => {
    expect(padNumber(1, 2) == "01");
  });
  test("Pad number to length of 4", () => {
    expect(padNumber(1, 4) == "0001");
  });
});
