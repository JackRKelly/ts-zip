import "jest";
import { expect } from "chai";
import { unzip } from "../src/unzip";
import {
  compressionMethod,
  CompressionMethod,
  formatModDate,
  formatModTime,
  padNumber,
} from "../src/util";
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
    expect(formatModTime(19368)).to.equal("09:29:16");
  });
  test("Format modification date function", () => {
    expect(formatModDate(20875)).to.equal("12/11/2020");
  });
  test("Pad number to length of 0", () => {
    expect(padNumber(1, 0)).to.equal("1");
  });
  test("Pad number to length of 2", () => {
    expect(padNumber(1, 2)).to.equal("01");
  });
  test("Pad number to length of 4", () => {
    expect(padNumber(1, 4)).to.equal("0001");
  });
  test("None compression method", () => {
    expect(compressionMethod(0)).to.equal(CompressionMethod.None);
  });
  test("Reserved compression method", () => {
    expect(compressionMethod(13)).to.equal(CompressionMethod.Reserved);
  });
  test("PPMd compression method", () => {
    expect(compressionMethod(98)).to.equal(CompressionMethod.PPMd);
  });
});
