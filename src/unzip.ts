import { Reader, Endian } from "./reader";
import * as fs from "fs";
import { compressionMethod, formatModTime, formatModDate } from "./util";

const readLocalFileHeader = (reader: Reader) => {
  let signature = reader.read4Bytes();
  let extractVersion = reader.read2Bytes();
  let bitFlag = reader.read2Bytes();
  let descriptorPresent = ((bitFlag >> 3) & 0b0000_0000_0000_1000) !== 0;
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
    descriptorPresent,
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
};

const readCentralDirectory = (reader: Reader) => {
  reader.offset = reader.findHeader("504b0102") + 4;
  let version = reader.read2Bytes();
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
  let fileCommentLength = reader.read2Bytes();
  let diskStart = reader.read2Bytes();
  let internalAttributes = reader.read2Bytes();
  let externalAttributes = reader.read4Bytes();
  let localHeaderOffset = reader.read4Bytes();
  let fileName = reader.sliceNBytes(fileNameLength).toString();
  let extraField = reader.sliceNBytes(extraFieldLength);
  let fileComment = reader.sliceNBytes(fileCommentLength).toString();

  console.log({
    endianness: Endian[reader.endian],
    version,
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
    fileCommentLength,
    diskStart,
    internalAttributes,
    externalAttributes,
    localHeaderOffset,
    fileName,
    extraField,
    fileComment,
  });
};

export function unzip(path: string) {
  fs.readFile(path, (err, data) => {
    if (err) console.error(err);
    const reader = new Reader(data);

    readLocalFileHeader(reader);
    readCentralDirectory(reader);
  });
}
