import { Reader, Endian } from "./reader";
import * as fs from "fs";

const compressionSwitch = (compressionBytes: number): string => {
  switch (compressionBytes) {
    case 0:
      return "no compression";
    case 1:
      return "shrunk";
    case 2:
      return "reduced with compression factor 1";
    case 3:
      return "reduced with compression factor 2";
    case 4:
      return "reduced with compression factor 3";
    case 5:
      return "reduced with compression factor 4";
    case 6:
      return "imploded";
    case 8:
      return "deflated";
    case 9:
      return "enhanced deflated";
    case 10:
      return "PKWare DCL imploded";
    case 12:
      return "compressed using BZIP2";
    case 14:
      return "LZMA";
    case 7:
    case 11:
    case 13:
    case 15:
    case 16:
    case 17:
      return "reserved";
    case 18:
      return "compressed using IBM TERSE";
    case 19:
      return "IBM LZ77 z";
    case 98:
      return "PPMd version I, Rev 1";
  }
};

const bufferToString = (buffer: Buffer): string => {
  return buffer.toString("hex").match(/../g).join(" ");
};

const minLength = (input: number, minLength: number): string => {
  let paddedNumber = input.toString();
  while (paddedNumber.length < minLength) {
    paddedNumber = "0" + paddedNumber;
  }
  return paddedNumber;
};

const decimalToBinary = (dec: number): string => {
  return dec.toString(2);
};

const formatModDate = (dateBytes: number): string => {
  let dayBits = dateBytes & 0b0000000_0000_11111;
  let monthBits = (dateBytes >> 5) & 0b0000000_1111;
  let yearBits = dateBytes >> 9;

  return `${minLength(monthBits, 2)}/${minLength(dayBits, 2)}/${minLength(
    yearBits + 1980,
    4
  )}`;
};

const formatModTime = (timeBytes: number): string => {
  let secondBits = timeBytes & 0b00000_000000_11111;
  let minuteBits = (timeBytes >> 5) & 0b00000_111111;
  let hourBits = timeBytes >> 11;

  return `${minLength(hourBits, 2)}:${minLength(minuteBits, 2)}:${minLength(
    secondBits * 2,
    2
  )}`;
};

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
