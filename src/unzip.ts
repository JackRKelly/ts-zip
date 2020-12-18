import { Reader, Endian } from "./reader";
import * as fs from "fs";
import { compressionSwitch, formatModTime, formatModDate } from "./util";

export function unzip(path: string) {
  fs.readFile(path, (err, data) => {
    if (err) console.error(err);
    const reader = new Reader(data);

    let signature = reader.read4Bytes(data);
    let extractVersion = reader.read2Bytes(data);
    let bitFlag = reader.read2Bytes(data);
    let compression = reader.read2Bytes(data);
    let compressionType = compressionSwitch(compression);
    let modTime = reader.read2Bytes(data);
    let modTimeFormatted = formatModTime(modTime);
    let modDate = reader.read2Bytes(data);
    let modDateFormatted = formatModDate(modDate);
    let crc32 = reader.read4Bytes(data);
    let compressedSize = reader.read4Bytes(data);
    let uncompressedSize = reader.read4Bytes(data);
    let fileNameLength = reader.read2Bytes(data);
    let extraFieldLength = reader.read2Bytes(data);
    let fileName = reader.sliceNBytes(data, fileNameLength).toString();
    let extraField = reader.sliceNBytes(data, extraFieldLength);

    console.log({
      endianness: Endian[reader.endian],
      signature,
      extractVersion,
      bitFlag,
      compressionType,
      modTimeFormatted,
      modDateFormatted,
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
