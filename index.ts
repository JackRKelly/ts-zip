import * as fs from "fs";

let zipPath = "./test.zip";

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
  return (dec >>> 0).toString(2);
};

const formatModDate = (buffer: Buffer): string => {
  let totalDate: number = (buffer.readUInt8(0) << 8) | buffer.readUInt8(1);

  let dayByte = totalDate & 0b0000000_0000_11111;
  let monthByte = (totalDate >> 5) & 0b0000000_1111;
  let yearByte = totalDate >> 9;

  return `${minLength(monthByte, 2)}/${minLength(dayByte, 2)}/${minLength(
    yearByte + 1980,
    4
  )}`;
};

const formatModTime = (buffer: Buffer): string => {
  let totalTime: number = (buffer.readUInt8(0) << 8) | buffer.readUInt8(1);

  let secondByte = totalTime & 0b00000_000000_11111;
  let minuteByte = (totalTime >> 5) & 0b00000_111111;
  let hourByte = totalTime >> 11;

  return `${minLength(hourByte, 2)}:${minLength(minuteByte, 2)}:${minLength(
    secondByte * 2,
    2
  )}`;
};

fs.readFile(zipPath, (err, data) => {
  if (err) console.error(err);

  let signature = data.slice(0, 4);
  let version = data.slice(4, 6);
  let flags = data.slice(6, 8);
  let compression = data.slice(8, 10);
  let compressionType = compressionSwitch(compression);
  let modTime = data.slice(11, 13);
  let modDate = data.slice(13, 15);
  let modTimeFormatted = formatModTime(modTime);
  let modDateFormatted = formatModDate(modDate);
});
