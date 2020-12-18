import { Reader, Endian } from "./reader";
import * as fs from "fs";
import { compressionMethod, formatModTime, formatModDate } from "./util";

export function unzip(path: string) {
  fs.readFile(path, (err, data) => {
    if (err) console.error(err);
    const reader = new Reader(data);

    let signature = reader.read4Bytes();
    let extractVersion = reader.read2Bytes();
    let bitFlag = reader.read2Bytes();
    let compression = compressionMethod(reader.read2Bytes());
    let modTime = formatModTime(reader.read2Bytes());
    let modDate = formatModDate(reader.read2Bytes());
    let crc32 = reader.read4Bytes();
    let compressedSize = reader.read4Bytes();
    let uncompressedSize = reader.read4Bytes();
    let fileNameLength = reader.read2Bytes();
    let extraFieldLength = reader.read2Bytes();
    let fileName = reader.sliceNBytes(fileNameLength).toString();
    let extraField = reader.sliceNBytes(extraFieldLength);

    console.log({
      endianness: Endian[reader.endian],
      signature,
      extractVersion,
      bitFlag,
      compression,
      modTime,
      modDate,
      crc32,
      compressedSize,
      uncompressedSize,
      fileNameLength,
      extraFieldLength,
      fileName,
      extraField,
    });
  });
}
