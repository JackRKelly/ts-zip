import { Reader } from "./reader";
import * as fs from "fs";

let zipPath = "./test.zip";

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

const bufferToUTF8 = (buffer: Buffer): string => {
  return buffer.toString("utf8");
};

const minLength = (input: number, minLength: number): string => {
  let paddedNumber = input.toString();
  while (paddedNumber.length < minLength) {
    paddedNumber = "0" + paddedNumber;
  }
  return paddedNumber;
};

const decimalToBinary = (dec: number): string => {
  return (dec >>> 0).toString(2);
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

fs.readFile(zipPath, (err, data) => {
  if (err) console.error(err);

  let signature = data.slice(0, 4);
  //Instantiate new reader class with signature to determine endianess.
  const reader = new Reader(signature);
  //Get minimum version required to extract.
  let extractVersionSlice = data.slice(4, 6);
  let extractVersion = reader.read2Bytes(extractVersionSlice);
  //General purpose bit flag.
  let bitFlag = data.slice(6, 8);
  //Compression method
  let compression = data.slice(8, 10);
  let compressionType = compressionSwitch(reader.read2Bytes(compression));
  //Last modification date and time and convert to readable format.
  let modTime = data.slice(10, 12);
  let modTimeFormatted = formatModTime(reader.read2Bytes(modTime));
  let modDate = data.slice(12, 14);
  let modDateFormatted = formatModDate(reader.read2Bytes(modDate));
  let crc32 = data.slice(14, 18);
  let compressedSlice = data.slice(18, 22);
  let compressedSize = reader.read4Bytes(compressedSlice);
  let uncompressedSlice = data.slice(22, 26);
  let uncompressedSize = reader.read4Bytes(uncompressedSlice);
  //Read the file name and convert to UTF8.
  let fileNameLengthSlice = data.slice(26, 28);
  let fileNameLength = reader.read2Bytes(fileNameLengthSlice);
  let extraFieldLengthSlice = data.slice(28, 30);
  let extraFieldLength = reader.read2Bytes(extraFieldLengthSlice);
  //The index when the file name byte stream ends.
  let fileNameEnd = 30 + fileNameLength;
  let fileNameSlice = data.slice(30, fileNameEnd);
  let fileName = bufferToUTF8(fileNameSlice);
  //The index when the extra field ends.
  let extraFieldEnd = fileNameEnd + extraFieldLength;
  let extraFieldSlice = data.slice(fileNameEnd, extraFieldEnd);

  console.log({
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
    extraFieldSlice,
  });
});
