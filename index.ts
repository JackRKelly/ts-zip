import * as fs from "fs";

let zipPath = "./test.zip";

const bufferToString = (buffer: Buffer): string => {
  return buffer.toString("hex").match(/../g).join(" ");
};

const minLength = (input: number, minLength: number) => {
  let paddedNumber = input.toString();
  while (paddedNumber.length < minLength) {
    paddedNumber = "0" + paddedNumber;
  }
  return paddedNumber;
};

const decimalToBinary = (dec: number) => {
  return (dec >>> 0).toString(2);
};

const formatModtime = (timeBuffer: Buffer) => {
  let totalTime: number =
    (timeBuffer.readUInt8(0) << 8) | timeBuffer.readUInt8(1);

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
  // console.log(data.toString("hex").match(/../g).join(" "));

  let signature = data.slice(0, 4);
  let version = data.slice(4, 6);
  let flags = data.slice(6, 8);
  let compression = data.slice(8, 10);
  let modTime = data.slice(10, 12);
  let modDate = data.slice(12, 14);
  // console.log(bufferToString(signature));
  let modTimeFormatted = formatModtime(modTime);
});
