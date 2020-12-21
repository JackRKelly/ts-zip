import {
  Reader,
  Endian,
  LocalFileHeader,
  CentralDirectory,
  EndCentralDirectory,
} from "./reader";
import * as fs from "fs";

export function unzip(path: string) {
  fs.readFile(path, (err, data) => {
    if (err) console.error(err);
    const reader = new Reader(data);

    let localFileHeaders: LocalFileHeader[] = reader.readLocalFileHeaders();
    let centralDirectories: CentralDirectory[] = reader.readCentralDirectories();
    let endCentralDirectory: EndCentralDirectory = reader.readEndCentralDirectory();

    console.log(
      localFileHeaders,
      centralDirectories,
      endCentralDirectory,
      Endian[reader.endian]
    );
  });
}
