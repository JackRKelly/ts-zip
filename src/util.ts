import { OS, CompressionMethod } from "./types";

export enum LESignature {
  LocalFile = 0x04034b50,
  DataDescriptor = 0x08074b50,
  CentralDirectory = 0x02014b50,
  EndCentralDirectory = 0x06054b50,
}

export const versionMade = (versionMade: number): OS => {
  switch (versionMade) {
    case 0:
      return OS.MSDOS;
    case 1:
      return OS.Amiga;
    case 2:
      return OS.OpenVMS;
    case 3:
      return OS.UNIX;
    case 4:
      return OS.VMCMS;
    case 5:
      return OS.AtariST;
    case 6:
      return OS.OS2HPFS;
    case 7:
      return OS.Macintosh;
    case 8:
      return OS.ZSystem;
    case 9:
      return OS.CPM;
    case 10:
      return OS.WindowsNTFS;
    case 11:
      return OS.MVS;
    case 12:
      return OS.VSE;
    case 13:
      return OS.AcornRisc;
    case 14:
      return OS.VFAT;
    case 15:
      return OS.AlternateMVS;
    case 16:
      return OS.BeOS;
    case 17:
      return OS.Tandem;
    case 18:
      return OS.OS400;
    case 19:
      return OS.OSX;
    default:
      return OS.Unused;
  }
};

export const compressionMethod = (
  compressionBytes: number
): CompressionMethod => {
  switch (compressionBytes) {
    case 0:
      return CompressionMethod.None;
    case 1:
      return CompressionMethod.Shrink;
    case 2:
      return CompressionMethod.Factor1;
    case 3:
      return CompressionMethod.Factor2;
    case 4:
      return CompressionMethod.Factor3;
    case 5:
      return CompressionMethod.Factor4;
    case 6:
      return CompressionMethod.Implode;
    case 8:
      return CompressionMethod.Deflate;
    case 9:
      return CompressionMethod.EnhancedDeflate;
    case 10:
      return CompressionMethod.PKWareDclImplode;
    case 12:
      return CompressionMethod.BZIP2;
    case 14:
      return CompressionMethod.LZMA;
    case 7:
    case 11:
    case 13:
    case 15:
    case 16:
    case 17:
      return CompressionMethod.Reserved;
    case 18:
      return CompressionMethod.IbmTerse;
    case 19:
      return CompressionMethod.IbmLZ77z;
    case 98:
      return CompressionMethod.PPMd;
  }
};

export const printBufferHex = (buffer: Buffer) => {
  return buffer.toString("hex").match(/../g).join(" ");
};

export const padNumber = (input: number, minLength: number): string => {
  let paddedNumber = input.toString();
  while (paddedNumber.length < minLength) {
    paddedNumber = "0" + paddedNumber;
  }
  return paddedNumber;
};

export const formatModDate = (dateBytes: number): string => {
  let dayBits = dateBytes & 0b0000000_0000_11111;
  let monthBits = (dateBytes >> 5) & 0b0000000_1111;
  let yearBits = dateBytes >> 9;

  return `${padNumber(monthBits, 2)}/${padNumber(dayBits, 2)}/${padNumber(
    yearBits + 1980,
    4
  )}`;
};

export const formatModTime = (timeBytes: number): string => {
  let secondBits = timeBytes & 0b00000_000000_11111;
  let minuteBits = (timeBytes >> 5) & 0b00000_111111;
  let hourBits = timeBytes >> 11;

  return `${padNumber(hourBits, 2)}:${padNumber(minuteBits, 2)}:${padNumber(
    secondBits * 2,
    2
  )}`;
};
