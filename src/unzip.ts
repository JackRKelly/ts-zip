import { Reader } from "./reader";
import { Endian } from "./util";
import * as fs from "fs";

export function unzip(path: string) {
  fs.readFile(path, (err, data) => {
    if (err) console.error(err);
    const reader = new Reader(data);

    let localFileHeaders = reader.readLocalFileHeaders();
    let centralDirectories = reader.readCentralDirectories();
    let endCentralDirectory = reader.readEndCentralDirectory();

    console.log(
      localFileHeaders,
      centralDirectories,
      endCentralDirectory,
      Endian[reader.endian]
    );
  });
}
