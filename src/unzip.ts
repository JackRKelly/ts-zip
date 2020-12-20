import { Reader, Endian } from "./reader";
import * as fs from "fs";
import { compressionMethod, formatModTime, formatModDate } from "./util";

const readLocalFileHeader = (reader: Reader) => {
  // 0	  | 4	: Local file header signature = 0x04034b50 (read as a little-endian number)
  // 4	  | 2	: Version needed to extract (minimum)
  // 6	  | 2	: General purpose bit flag
  // 8	  | 2	: Compression method
  // 10	  | 2	: File last modification time
  // 12	  | 2	: File last modification date
  // 14	  | 4	: CRC-32 of uncompressed data
  // 18	  | 4	: Compressed size
  // 22	  | 4	: Uncompressed size
  // 26	  | 2	: File name length (n)
  // 28	  | 2	: Extra field length (m)
  // 30	  | n	: File name
  // 30+n	| m	: Extra field

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
  // 0	    | 4	: Central directory file header signature = 0x02014b50
  // 4	    | 2	: Version made by
  // 6	    | 2	: Version needed to extract (minimum)
  // 8	    | 2	: General purpose bit flag
  // 10	    | 2	: Compression method
  // 12	    | 2	: File last modification time
  // 14	    | 2	: File last modification date
  // 16	    | 4	: CRC-32 of uncompressed data
  // 20	    | 4	: Compressed size
  // 24	    | 4	: Uncompressed size
  // 28	    | 2	: File name length (n)
  // 30	    | 2	: Extra field length (m)
  // 32	    | 2	: File comment length (k)
  // 34	    | 2	: Disk number where file starts
  // 36	    | 2	: Internal file attributes
  // 38	    | 4	: External file attributes
  // 42	    | 4	: Relative offset of local file header. This is the number of bytes between the start of the first disk on which the file occurs, and the start of the local file header. This allows software reading the central directory to locate the position of the file inside the ZIP file.
  // 46	    | n	: File name
  // 46+n	  | m	: Extra field
  // 46+n+m	| k	: File comment

  reader.offset = reader.findHeader("504b0102");
  let signature = reader.read4Bytes();
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
    signature,
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
    readEndCentralDirectory(reader);
  });
}
