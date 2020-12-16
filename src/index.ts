// CLI entrypoint
// for now it just uses the test zip because we're just printing the data in unzip()

import { unzip } from "./unzip";
import * as path from "path";

unzip(path.join(__dirname, "../test/test.zip"));
