import "jest";
import { expect } from "chai";

import * as path from "path";

import { unzip } from "../src/unzip";

describe("Unzip", () => {
  // TODO: jack pls specify any specifics about the provided zip in name?
  test("Random zip", () => {
    const mockUnzip = jest.fn(() => unzip(path.join(__dirname, "test.zip")));
    mockUnzip();
  });
});
